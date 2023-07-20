"use strict"

const Database = require("./common/database");
const express = require("express");
const morgan = require('morgan');
const dayjs = require('dayjs');
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const { initAuthentication, isLoggedIn } = require("./common/auth");
const passport = require("passport");

const ADMIN_VALUE = "admin"

const EDITABLE = "editable"
// init express
const PORT = 3001;
const db = new Database("cms.db");

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/static', express.static('./common/images'));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


initAuthentication(app, db);



/**
 * Authenticate
 */


// login
app.post(
  "/api/session",
  body("username", "username is not a valid email").isEmail(),
  body("password", "password must be a non-empty string").isString().notEmpty(),
  (req, res, next) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      err.errors.map(e => errList.push(e.msg))
      return res.status(400).json({ errors: errList });
    }

    // Perform the actual authentication
    passport.authenticate("local", (err, user) => {
      if (err) {
        res.status(err.status).json({ errors: [err.msg] });
      } else {
        req.login(user, err => {
          if (err) return next(err);
          else {
            // Get the pages
            if (user !== null) {
              db.getAllPages()
                .then(pages => res.status(200).json("ok"))
                .catch(() => {
                  res.status(500).json({ errors: ["Database error"] });
                });
            } else {
              res.json({ email: user.username, name: user.name, type: user.type });
            }
          }
        });
      }
    })(req, res, next);
  }
);

// logout
app.delete('/api/session/current', (req, res) => {
  req.logout(() => { res.end(); });
});

/**
 * Other API impl
 */


//get page by id front office
app.get("/api/frontoffice/pages/:id", async (req, res) => {

  const headers = await db.getAllHeadersByPageId(req.params.id);
  const images = await db.getAllImgByPageId(req.params.id);
  const paragraphs = await db.getAllParagraphsByPageId(req.params.id);
  const content = [];
  content.push(...headers);
  content.push(...images);
  content.push(...paragraphs);

  db.getPageById(req.params.id)
    .then(async page => {
      const author = await db.getAuthorById(page.u_id);
      page.author_name = author.name;
      res.json({ page_data: { ...page, content: content } })
    })
    .catch(() => res.status(500).json({ errors: ["Database error"] }))
})

//get all pages for front office
app.get("/api/frontoffice/pages", (req, res) => {
  db.getAllPages()
    .then(result => {
      res.json(
        result
          .filter(page => dayjs(page.publication_date).isSame(dayjs()) || dayjs().isAfter(dayjs(page.publication_date)))
          .sort((a, b) => dayjs(a.publication_date).isBefore(dayjs(b.publication_date)) ? 1 : -1)
          .map(page => {
            return { page_data: page }
          })
      )
    })
    .catch(() => res.status(500).json({ errors: ["Database error"] }))
});

// back office
app.get("/api/backoffice/pages", isLoggedIn, (req, res) => {

  db.getAllPages()
    .then(result => {
      res.json(
        result
          .filter(page => dayjs(page.publication_date).isSame(dayjs()) || dayjs(page.publication_date).isBefore(dayjs()) || dayjs(page.publication_date).isAfter(dayjs()) || req.user.id === page.u_id) 
          .sort((a, b) => dayjs(a.publication_date).isBefore(dayjs(b.publication_date)) ? 1 : -1)
          .map(page => {
            return { page_data: page, published: dayjs(page.publication_date).isSame(dayjs()) || dayjs(page.publication_date).isBefore(dayjs()) ? "Published" : dayjs(page.publication_date).isAfter(dayjs()) ? "Programmed" : "Draft" }
          })
      )
    })
    .catch(() => res.status(500).json({ errors: ["Database error"] }))


});


// get all images
app.get("/api/backoffice/images", isLoggedIn, (req, res) => {

  db.getAllImages()
    .then(results => {
      res.json(
        results
      )
    })
    .catch(() => res.status(500).json({ errors: ["Database error"] }))


});



//get page by id for back office   published: dayjs(page.publication_date).isSame(dayjs()) || dayjs().isAfter(dayjs(page.publication_date)) ? "Published" : dayjs().isBefore(dayjs(page.publication_date)) ? "Programmed": "Draft"
app.get("/api/backoffice/pages/:id", isLoggedIn, async (req, res) => {

  const headers = await db.getAllHeadersByPageId(req.params.id);
  const images = await db.getAllImgByPageId(req.params.id);
  const paragraphs = await db.getAllParagraphsByPageId(req.params.id);
  const content = [];
  content.push(...headers);
  content.push(...images);
  content.push(...paragraphs);

  db.getPageById(req.params.id)
    .then(async page => {
      const author = await db.getAuthorById(page.u_id);
      page.author_name = author.name;
      res.json({ page_data: { ...page, content: content }, editable: (req.user.type === ADMIN_VALUE ? ADMIN_VALUE : page.u_id === req.user.id ? EDITABLE : false), published: dayjs(page.publication_date).isSame(dayjs()) || dayjs().isAfter(dayjs(page.publication_date)) ? "Published" : dayjs(page.publication_date).isValid() ? "Programmed" : "Draft" })
    })
    .catch(() => res.status(500).json({ errors: ["Database error"] }))

})


//create new page
app.post("/api/backoffice/pages",
  isLoggedIn,
  async (req, res) => {
    try {
      const page_id = await db.createNewPage({
        u_id: req.user.id,
        creation_date: dayjs().format("YYYY-MM-DD"),
        publication_date: req.body.publication_date ? req.body.publication_date : dayjs().format("YYYY-MM-DD"),
        web_site_name: req.body.web_site_name ? req.body.web_site_name : "New page"
      });
      req.body
        .content
        .forEach(
          async elt => {

            if (elt.header_content) {
              if (elt.added) {
                await db.createHeader({
                  p_id: page_id,
                  header_content: elt.header_content ? elt.header_content : "New header",
                  order: elt.order
                });
              }
            } else if (elt.img_path) {
              if (elt.added) {
                await db.createImage({
                  p_id: page_id,
                  img_bank_id: elt.img_bank_id,
                  img_path: elt.img_path,
                  order: elt.order
                });
              }
            } else if (elt.paragraph_content) {
              if (elt.added) {
                await db.createParagraph({
                  p_id: page_id,
                  paragraph_content: elt.paragraph_content ? elt.paragraph_content : "New paragraph",
                  order: elt.order
                });
              }
            }
          }
        );
      res.json("ok")
    } catch {
      res.status(500).json({ errors: ["Database error"] })
    }
  });

//update a page by id

app.post("/api/backoffice/pages/:id",
  isLoggedIn,
  async (req, res) => {
    try {
      req.body
        .content
        .forEach(
          async elt => {

            if (elt.header_content) {
              if (elt.deleted) {
                elt.h_id ? await db.deleteHeaderById(elt.h_id) : console.log("");
              } else {
                if (!elt.added) {
                  await db.updateHeaderByheaderIdAndPageId(
                    {
                      header_content: elt.header_content ? elt.header_content : "New header",
                      order: elt.order,
                      h_id: elt.h_id,
                      p_id: Number(req.params.id)
                    }
                  )
                } else {
                  await db.createHeader({
                    p_id: req.params.id,
                    header_content: elt.header_content ? elt.header_content : "New header",
                    order: elt.order
                  })
                }
              }
            } else if (elt.img_path) {
              if (elt.deleted) {
                elt.img_id ? await db.deleteImageById(elt.img_id) : console.log("");
              } else {
                if (!elt.added) {
                  await db.updateImgByImgIdAndPageId(
                    {
                      img_bank_id: elt.img_bank_id,
                      img_path: elt.img_path,
                      order: elt.order,
                      img_id: elt.img_id,
                      p_id: req.params.id
                    }
                  )
                } else {
                  await db.createImage({
                    p_id: req.params.id,
                    img_bank_id: elt.img_bank_id,
                    img_path: elt.img_path,
                    order: elt.order
                  })
                }
              }
            } else if (elt.paragraph_content) {
              if (elt.deleted) {
                elt.pg_id ? await db.deleteParagraphById(elt.pg_id) : console.log("");
              } else {
                if (!elt.added) {
                  await db.updateParagraphByParagraphIdAndPageId(
                    {
                      paragraph_content: elt.paragraph_content ? elt.paragraph_content : "New paragraph",
                      order: elt.order,
                      pg_id: elt.pg_id,
                      p_id: Number(req.params.id)
                    }
                  )
                } else {
                  await db.createParagraph({
                    p_id: req.params.id,
                    paragraph_content: elt.paragraph_content ? elt.paragraph_content : "New paragraph",
                    order: elt.order
                  })
                }
              }
            }
          }
        );
      if (!req.body.admin) {
        await db.updatePagePublicationDateByPageId({ publication_date: req.body.publication_date, page_id: req.params.id })
      } else {
        const id_object = req.body.email ? await db.getAuthorIdByEmail({ email: req.body.email }) : { id: req.user.id };
        await db.updatePagePWUByPageId({ publication_date: req.body.publication_date, web_site_name: req.body.web_site_name, u_id: id_object.id, page_id: req.params.id })
      }
      res.json("ok")
    } catch {
      res.status(500).json({ errors: ["Database error"] })
    }
  })


// get authors

app.get("/api/backoffice/authors", isLoggedIn, (req, res) => {
  if (!req.query.name && !req.query.email) {
    db.getAuthors()
      .then(results => {
        res.json(
          results
        );
      })
      .catch(() => res.status(500).json({ errors: ["Database error"] }));
  } else {
    db.getAuthorIdByEmail({ email: req.query.email })
      .then(result => {
        res.json(
          result
        );
      })
      .catch(() => res.status(500).json({ errors: ["Database error"] }));
  }
}
)


//delete page

app.delete("/api/backoffice/pages/:id", isLoggedIn, async (req, res) => {

  if (req.user.type === ADMIN_VALUE) {
    await db.deleteHeader(req.params.id);
    await db.deleteImage(req.params.id);
    await db.deleteParagraph(req.params.id);
    await db.deletePage(req.params.id)
      .then(() => res.json("ok"))
      .catch(() => res.status(500).json({ errors: ["Database error"] }))
  } else {
    db.getPageByUserIdAndPageId(req.user.id, req.params.id)
      .then(
        async result => {
          if (result.length !== 0) {
            await db.deleteHeader(req.params.id);
            await db.deleteImage(req.params.id);
            await db.deleteParagraph(req.params.id);
            db.deletePage(req.params.id)
              .then(() => res.json("ok"))
              .catch(() => res.status(500).json({ errors: ["Database error"] }))
          } else {
            res.end("auhtor not found")
          }
        }

      )
      .catch(() => res.status(500).json({ errors: ["Database error"] }));
  }

})



// activate the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

