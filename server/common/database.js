"use strict"

const sqlite = require("sqlite3");
const crypto = require("crypto");

/**
 * Wrapper around db.all
 */
const dbAllAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});


/**
 * Wrapper around db.run
 */
const dbRunAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) {
      reject(err);
    } else {
      resolve({ lastID: this.lastID });
    }
  });
});

/**
 * Wrapper around db.get
 */
const dbGetAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

/**
 * Interface to the sqlite database for the application
 *
 * @param dbname name of the sqlite3 database file to open
 */
function Database(dbname) {
  this.db = new sqlite.Database(dbname, err => {
    if (err) throw err;
  });



  // common

  //get all images infos


  this.getAllImages = async () => {
    try {
      const images = await (dbAllAsync(this.db, "SELECT * FROM images_bank", []));
      return images;
    } catch (err) {
      return err;
    }
  }

  // get all headers by page id
  this.getAllHeadersByPageId = async (id) => {
    try {
      const headers = await (dbAllAsync(this.db, "SELECT * FROM headers WHERE p_id = ?", [id]));
      return headers;
    } catch (err) {
      return err;
    }
  };


  // get all images by page id
  this.getAllImgByPageId = async (id) => {
    try {
      const images = await (dbAllAsync(this.db, "SELECT * FROM images WHERE p_id = ?", [id]));
      return images;
    } catch (err) {
      return err;
    }
  };

  // get all paragraphs by page id
  this.getAllParagraphsByPageId = async (id) => {
    try {
      const paragraphs = await (dbAllAsync(this.db, "SELECT * FROM paragraphs WHERE p_id = ?", [id]));
      return paragraphs;
    } catch (err) {
      return err;
    }
  };


  // update header content by Page Id and Paragraph Id

  this.updateHeaderByheaderIdAndPageId = async (header) => {
    try {
      const paragraphs = await (dbRunAsync(this.db, "UPDATE headers SET header_content = ?, 'order'= ? WHERE h_id = ? AND p_id = ?", Object.values(header)));
      return paragraphs;
    } catch (err) {
      return err;
    }
  };



  // update header content by Page Id and Paragraph Id

  this.updateImgByImgIdAndPageId = async (image) => {
    try {
      const result = await (dbRunAsync(this.db, "UPDATE images SET img_bank_id = ?, img_path = ?, 'order'= ? WHERE img_id = ? AND p_id = ?", Object.values(image)));
      return;
    } catch (err) {
      return err;
    }
  };


  // update header content by Page Id and Paragraph Id

  this.updateParagraphByParagraphIdAndPageId = async (paragraph) => {
    try {
      const result = await (dbRunAsync(this.db, "UPDATE paragraphs SET paragraph_content = ?, 'order' = ? WHERE pg_id = ? AND p_id = ?", Object.values(paragraph)));
      return result;
    } catch (err) {
      return err;
    }
  };



  // create new header

  this.createHeader = async (header) => {
    try {
      const result = await (dbRunAsync(this.db, "INSERT INTO headers (p_id, header_content, 'order') VALUES (?, ?, ?)", Object.values(header)));
      return result;
    } catch (err) {
      return err;
    }
  };



  // create new image

  this.createImage = async (image) => {
    try {
      const result = await (dbRunAsync(this.db, "INSERT INTO images (p_id, img_bank_id, img_path, 'order') VALUES (?, ?, ?, ?)", Object.values(image)));
      return result;
    } catch (err) {
      return err;
    }
  };


  // create new paragraph

  this.createParagraph = async (paragraph) => {
    try {
      const result = await (dbRunAsync(this.db, "INSERT INTO paragraphs (p_id, paragraph_content, 'order') VALUES (?, ?, ?)", Object.values(paragraph)));
      return result;
    } catch (err) {
      return err;
    }
  };


  // update publication date page by id

  this.updatePagePublicationDateByPageId = async (page_info) => {
    try {
      const result = await (dbRunAsync(this.db, "UPDATE pages SET publication_date = ? WHERE page_id = ?", Object.values(page_info)));
      return result;
    } catch (err) {
      return err;
    }
  };


  // update publication, web site and u_id page too

  this.updatePagePWUByPageId = async (page_info) => {
    try {
      const result = await (dbRunAsync(this.db, "UPDATE pages SET publication_date = ?, web_site_name = ?, u_id = ? WHERE page_id = ?", Object.values(page_info)));
      return result;
    } catch (err) {
      return err;
    }
  };


  // insert new pages ???
  this.createNewPage = async (page) => {
    try {
      const result = await dbRunAsync(this.db, "INSERT INTO pages (u_id, creation_date, publication_date, web_site_name) VALUES (?, ?, ?, ?)", Object.values(page));
      return result.lastID;
    } catch (err) {
      return err;
    }
  };
  
  
  
  

  //this delete header by page_id

  this.deleteHeader = async (id) => {
    try {
      const done = await (dbRunAsync(this.db, "Delete  FROM headers where p_id = ?", [id]));
      return done;
    } catch (err) {
      throw err;
    }
  }

  
  //this delete header by h_id

  this.deleteHeaderById = async (id) => {
    try {
      const done = await (dbRunAsync(this.db, "Delete  FROM headers where h_id= ?", [id]));
      return done;
    } catch (err) {
      throw err;
    }
  }

  //this delete image by page id

  this.deleteImage = async (id) => {
    try {
      const done = await (dbRunAsync(this.db, "Delete  FROM images where p_id = ?", [id]));
      return done;
    } catch (err) {
      throw err;
    }
  }

    
   
  //this delete image by img_id

  this.deleteImageById = async (id) => {
    try {
      const done = await (dbRunAsync(this.db, "Delete  FROM images where img_id= ?", [id]));
      return done;
    } catch (err) {
      throw err;
    }
  }

    //this delete paragraph by oage_id

    this.deleteParagraph = async (id) => {
      try {
        const done = await (dbRunAsync(this.db, "Delete  FROM paragraphs where p_id = ?", [id]));
        return done;
      } catch (err) {
        throw err;
      }
    }


       
  //this delete paragraph by pg_id

  this.deleteParagraphById = async (id) => {
    try {
      const done = await (dbRunAsync(this.db, "Delete  FROM paragraphs where pg_id= ?", [id]));
      return done;
    } catch (err) {
      throw err;
    }
  }



  /**
   * Retrieve the list of all pages from the db
   *
   * @returns a Promise that resolves to the list of pages
   *          objects as: {page_id, u_id, creation_date, publication_date, header_content, img_path, paragraph_content, header_order, img_order, paragraph_order, nome_sito}
   */

  this.getAllPages = async () => {
    try {
      const pages = await (dbAllAsync(this.db, "SELECT * FROM pages", []));
      return pages;
    } catch (err) {
      return err;
    }
  }

  /**
   * Retrieve the corresponding page for the provided id
   *
   * @returns a Promise that resolves to page
   *          objects as: {page_id, u_id, creation_date, publication_date, header_content, img_path, paragraph_content, header_order, img_order, paragraph_order, nome_sito}
   */

  this.getPageById = async (id) => {
    try {
      const page = await (dbGetAsync(this.db, "SELECT * FROM pages WHERE page_id= ?", [id]));
      return page;
    } catch (err) {
      return err;
    }
  }


  /**
 * Retrieve the corresponding author of a page by is id
 *
 * @returns a Promise that resolves to page
 *          objects as: {page_id, u_id, creation_date, publication_date, header_content, img_path, paragraph_content, header_order, img_order, paragraph_order, nome_sito}
 */
/*
  this.getAuthorById = async (id) => {
    try {
      const author = await (dbGetAsync(this.db, "SELECT type FROM users WHERE id= ?", [id]));
      return author;
    } catch (err) {
      return err;
    }
  }*/


  /**
 * Retrieve all the users
 *
 * @returns a Promise that resolves to page
 *          objects as: {page_id, u_id, creation_date, publication_date, header_content, img_path, paragraph_content, header_order, img_order, paragraph_order, nome_sito}
 */

  this.getAuthors = async () => {
    try {
      const authors = await (dbAllAsync(this.db, "SELECT name, email FROM users", []));
      return authors;
    } catch (err) {
      return err;
    }
  }


    /**
 * Retrieve all the users
 *
 * @returns a Promise that resolves to page
 *          objects as: {page_id, u_id, creation_date, publication_date, header_content, img_path, paragraph_content, header_order, img_order, paragraph_order, nome_sito}
 */

    this.getAuthorById = async (id) => {
      try {
        const authors = await (dbGetAsync(this.db, "SELECT name, email FROM users WHERE id = ?", [id]));
        return authors;
      } catch (err) {
        return err;
      }
    }


  /**
* Retrieve usrid by Name and email
*
* @returns a Promise that resolves to page
*          objects as: {page_id, u_id, creation_date, publication_date, header_content, img_path, paragraph_content, header_order, img_order, paragraph_order, nome_sito}
*/

  this.getAuthorIdByEmail = async (author) => {
    try {
      const id = await (dbGetAsync(this.db, "SELECT id FROM users WHERE email = ?", [author.email]));
      return id;
    } catch (err) {
      return err;
    }
  }



  /**
  * delete page
  *
  * @returns a Promise that resolves to the list of pages
  *          objects as: {page_id, u_id, creation_date, publication_date, header_content, img_path, paragraph_content, header_order, img_order, paragraph_order, nome_sito}
  */

  this.deletePage = async (id) => {
    try {
      const done = await (dbRunAsync(this.db, "Delete  FROM pages where page_id = ?", [id]));
      return done;
    } catch (err) {
      throw err;
    }
  }



  this.getPageByUserIdAndPageId = async (userId, pageId) => {
    try {
      const done = await (dbAllAsync(this.db, "Select page_id FROM pages where u_id = ? and page_id = ?", [userId, pageId]));
      return done;
    } catch (err) {
      throw err;
    }
  }






  // db authentication operation


  /**
     * Authenticate a user from their email and password
     * 
     * @param email email of the user to authenticate
     * @param password password of the user to authenticate
     * 
     * @returns a Promise that resolves to the user object {id, username, name, type}
     */

  this.authUser = (email, password) => new Promise((resolve, reject) => {
    // Get the user with the given email
    dbGetAsync(
      this.db,
      "select * from users where email = ?",
      [email]
    )
      .then(user => {
        // If there is no such user, resolve to false.
        // This is used instead of rejecting the Promise to differentiate the
        // failure from database errors
        if (!user) resolve(user);

        // Verify the password
        crypto.scrypt(password, user.salt, 32, (err, hash) => {
          if (err) reject(err);

          if (crypto.timingSafeEqual(hash, Buffer.from(user.hash, "hex")))
            resolve({ id: user.id, username: user.email, name: user.name, type: user.type }); // Avoid full_time = null being cast to false
          else resolve(false);
        });
      })
      .catch(e => reject(e));
  });

  /**
  * Retrieve the user with the specified id
  * 
  * @param id the id of the user to retrieve
  * 
  * @returns a Promise that resolves to the user object {id, username, name, type}
  */
  this.getUser = async id => {
    const user = await dbGetAsync(
      this.db,
      "select * from users where id = ?",
      [id]
    );
    return user;

  }

}



module.exports = Database