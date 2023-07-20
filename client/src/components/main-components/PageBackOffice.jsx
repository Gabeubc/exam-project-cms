/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState } from "react"
import NavBar from "../sub-components/NavBar"
import { Container, Image, Form, Button, Badge } from 'react-bootstrap'
import cloneDeep from 'lodash.clonedeep';
import { MdDeleteForever } from 'react-icons/md'
import { ImArrowLeft2, ImArrowRight2, ImArrowUp2, ImArrowDown2 } from 'react-icons/im'
import API from "../../common/API"
import { useNavigate } from "react-router-dom"


const ADMIN_VALUE = "admin";

function PageBackOffice(props) {

    const [contentState, setContentState] = useState(props.page.page_data.content.sort((elt1, elt2) => elt1.order - elt2.order));

    const [publicationDateState, setPublicationDateState] = useState(props.page.page_data.publication_date);

    const [webSiteNameState, setWebSiteNameState] = useState(props.page.page_data.web_site_name);

    const [authorState, setAuthorState] = useState();

    const [isPagePublished, setIsPagePublished] = useState(false);

    const [sizeContentState, setSizeContentState] = useState(props.page.page_data.content.length);

    const navigate = useNavigate();

    async function handleDelete(id) {
        await API.DeletePage(id);
        await props.interfaceSetStatePageUpdate(true);
        navigate("/");
    }

    function handleChangeParagraph(elt, value) {
        const elt_copy = cloneDeep(elt);
        elt_copy.paragraph_content = value ? value : " ";
        const newContentState = contentState.map((item, index) => {
            if (index === elt_copy.order) {
                return elt_copy;
            } else {
                return cloneDeep(item);
            }
        });

        setContentState(newContentState);
        setIsPagePublished(false);
    }





    function handleClickLeftImage(elt, images) {

        let elt_copy = cloneDeep(elt);
        elt_copy.img_bank_id = cloneDeep(images[elt.img_bank_id - 2].img_id);
        elt_copy.img_path = cloneDeep(images[elt.img_bank_id - 2].img_path);
        const newContentState = contentState.map((item) => {
            if (item.order === elt_copy.order) {
                return elt_copy;
            } {
                return cloneDeep(item);
            }
        });
        // elt_copy.order = cloneDeep(elt.order);
        setContentState(newContentState);
        setIsPagePublished(false);

    }


    function handleClickRigthImage(elt, images) {

        let elt_copy = cloneDeep(elt);
        elt_copy.img_bank_id = cloneDeep(images[elt.img_bank_id].img_id);
        elt_copy.img_path = cloneDeep(images[elt.img_bank_id].img_path);
        const newContentState = contentState.map((item) => {
            if (item.order === elt_copy.order) {
                return elt_copy;
            } else {
                return cloneDeep(item);
            }
        });
        //elt_copy.order = cloneDeep(elt.order);
        setContentState(newContentState);
        setIsPagePublished(false);
    }

    function handleUpClickElt(elt) {
        let elt_copy = cloneDeep(elt);
        let newContentState = cloneDeep(contentState);

        const previousIndex = elt_copy.order - 1;
        const nextElt = cloneDeep(newContentState[previousIndex]);

        newContentState[elt_copy.order] = nextElt;
        newContentState[previousIndex] = elt_copy;
        newContentState[elt_copy.order].order = elt_copy.order;
        newContentState[previousIndex].order = previousIndex;

        setContentState(newContentState);
        setIsPagePublished(false);
    }



    function handleDownClickElt(elt) {
        let elt_copy = cloneDeep(elt);
        let newContentState = cloneDeep(contentState);

        const nextIndex = elt_copy.order + 1;
        const nextElt = cloneDeep(newContentState[nextIndex]);

        newContentState[elt_copy.order] = nextElt;
        newContentState[nextIndex] = elt_copy;
        newContentState[elt_copy.order].order = elt_copy.order;
        newContentState[nextIndex].order = nextIndex;


        setContentState(newContentState);
        setIsPagePublished(false);
    }




    function handleTrashClick(elt) {
        let count = 0;
        let endContent = contentState.length;
        let tmp = cloneDeep(elt);
        let newContentState = cloneDeep(contentState);
        let updatedContentState = contentState
            .sort((itemA, itemB) => itemA.order - itemB.order)
            .map(
                (item, index) => {
                    if (item.order == tmp.order) {
                        if (item.header_content) {
                            item.order = -1;
                            item.deleted = true;
                            item.added = false;
                            return cloneDeep(item);
                        }
                        if (item.img_path) {
                            item.order = -1;
                            item.deleted = true;
                            item.added = false;
                            return cloneDeep(item);
                        }
                        if (item.paragraph_content) {
                            item.order = -1;
                            item.deleted = true;
                            item.added = false;
                            return cloneDeep(item);
                        }
                    } else {
                        return cloneDeep(item);
                    }
                }
            )
            .map(
                elt => {
                    if (!elt.deleted) {
                        elt.order = count++;
                        return cloneDeep(elt);
                    } else {
                        elt.order = endContent++;
                        return cloneDeep(elt);
                    }
                }
            );
        setContentState(updatedContentState.sort((itemA, itemB) =>
            itemA.order - itemB.order
        ));
        setSizeContentState(count);
        setIsPagePublished(false);
    }


    function handleChangeHeader(elt, value) {
        const elt_copy = cloneDeep(elt);
        elt_copy.header_content = value ? value : " ";

        const newContentState = contentState.map((elt, index) => {
            if (index === elt_copy.order) {
                return elt_copy;
            } else {
                return cloneDeep(elt);
            }
        });

        setContentState(newContentState);
        setIsPagePublished(false);
    }



    function handleAddHeader() {
        const newContentState = cloneDeep(contentState);
        let newHeader = {
            p_id: props.page.page_data.page_id,
            header_content: " ",
            order: sizeContentState,
            added: true
        };
        newContentState.push(newHeader);
        setContentState(newContentState.sort((itemA, itemB) =>
            itemA.order - itemB.order
        ));
        setSizeContentState(sizeContentState => sizeContentState + 1);
        setIsPagePublished(false);
    }


    function handleAddParagraph() {
        const newContentState = cloneDeep(contentState);
        let newParagraph = {
            p_id: props.page.page_data.page_id,
            paragraph_content: " ",
            order: sizeContentState,
            added: true
        };
        newContentState.push(newParagraph);

        setContentState(newContentState.sort((itemA, itemB) =>
            itemA.order - itemB.order
        ));
        setSizeContentState(sizeContentState => sizeContentState + 1);
        setIsPagePublished(false);
    }


    function handleAddImage() {
        const newContentState = cloneDeep(contentState);
        let newImage = {
            p_id: props.page.page_data.page_id,
            img_bank_id: props.stateImages[0].img_id,
            img_path: props.stateImages[0].img_path,
            order: sizeContentState,
            added: true
        };
        newContentState.push(newImage);
        setContentState(newContentState);
        setSizeContentState(sizeContentState => sizeContentState + 1);
        setIsPagePublished(false);
    }

    async function handlePublish(id, admin, webSiteName, publicationDate, email) {
        await API.UpdatePageGeneric(id, { content: contentState, admin: admin, web_site_name: webSiteName, publication_date: publicationDate, email: email });
        setIsPagePublished(true);
    }

    const LayoutPage = [];
    let count_h = 0;
    contentState
        .forEach(
            (elt, index) => {
                if (elt.header_content && index < sizeContentState)
                    count_h++;
            }
        );

    const only_header = count_h === sizeContentState ? true : false;

    if (count_h < 2) {



        contentState
            .forEach((elt, index) => {
                if (elt.header_content) {
                    if (!elt.deleted)
                        LayoutPage[elt.order] = (

                            <Form.Group className="custom-header-form" key={elt.order}>
                                <Container className="custom-arrows-block">
                                    {
                                        elt.order === 0 ?
                                            <></> :
                                            <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                    }
                                    {

                                        elt.order === sizeContentState - 1 ?
                                            <></> :
                                            <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                    }
                                </Container>
                                <Form.Control size="lg" type="text" value={elt.header_content} onChange={env => handleChangeHeader(elt, env.target.value)} placeholder="Insert your header here" />
                            </Form.Group>

                        );
                } else if (elt.img_path) {
                    if (!elt.deleted)
                        LayoutPage[elt.order] = (
                            <Container className="custom-img-container" key={elt.order}>
                                <Container className="custom-arrows-block">
                                    {
                                        elt.order === 0 ?
                                            <></> :
                                            <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                    }
                                    {

                                        elt.order === sizeContentState - 1 ?
                                            <></> :
                                            <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                    }
                                </Container>
                                <Container className="d-flex flex-column custom-img-container-sub">
                                    <Image src={`http://localhost:3001/static/${elt.img_path}`} className="custom-img-page" />
                                    <Container className="d-flex custom-arrows-img">
                                        {
                                            elt.img_bank_id === 1 ?
                                                <></> :
                                                <ImArrowLeft2 className="custom-arrow" onClick={() => { handleClickLeftImage(elt, props.stateImages) }} />


                                        }
                                        {
                                            elt.img_bank_id === props.stateImages.length ?
                                                <></> :
                                                <ImArrowRight2 className="custom-arrow" onClick={() => { handleClickRigthImage(elt, props.stateImages) }} />


                                        }
                                    </Container>
                                </Container >
                            </Container>
                        );
                } else if (elt.paragraph_content) {
                    if (!elt.deleted)
                        LayoutPage[elt.order] = (

                            <Form.Group className="custom-paragraph-form" key={elt.order}>
                                <Container className="custom-arrows-block">
                                    {

                                        elt.order === 0 ?
                                            <></> :
                                            <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                    }
                                    {

                                        elt.order === sizeContentState - 1 ?
                                            <></> :
                                            <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                    }
                                </Container>
                                <Form.Control size="md" as="textarea" value={elt.paragraph_content} rows={6} onChange={env => handleChangeParagraph(elt, env.target.value)} placeholder="Inser your paragraph here" />

                            </Form.Group>

                        );
                }

            });


        ////

    } else {

        contentState
            .forEach((elt, index) => {
                if (elt.header_content) {
                    if (!elt.deleted)
                        LayoutPage[elt.order] = (

                            <Form.Group className="custom-header-form" key={elt.order}>
                                <Container className="custom-arrows-block">
                                    {
                                        elt.order === 0 ?
                                            <></> :
                                            <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                    }
                                    {

                                        elt.order === sizeContentState - 1 ?
                                            <></> :
                                            <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                    }
                                </Container>
                                <Form.Control size="lg" type="text" value={elt.header_content} onChange={env => handleChangeHeader(elt, env.target.value)} placeholder="Insert your header here" />
                                <Container className="custom-arrows-block" >
                                    <MdDeleteForever className="custom-trash" onClick={() => handleTrashClick(elt)} />
                                </Container>
                            </Form.Group>

                        );
                } else if (elt.img_path) {
                    if (!elt.deleted)
                        LayoutPage[elt.order] = (
                            <Container className="custom-img-container" key={elt.order}>
                                <Container className="custom-arrows-block">
                                    {
                                        elt.order === 0 ?
                                            <></> :
                                            <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                    }
                                    {

                                        elt.order === sizeContentState - 1 ?
                                            <></> :
                                            <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                    }
                                </Container>
                                <Container className="d-flex flex-column custom-img-container-sub">
                                    <Image src={`http://localhost:3001/static/${elt.img_path}`} className="custom-img-page" />
                                    <Container className="d-flex custom-arrows-img">
                                        {
                                            elt.img_bank_id === 1 ?
                                                <></> :
                                                <ImArrowLeft2 className="custom-arrow" onClick={() => { handleClickLeftImage(elt, props.stateImages) }} />


                                        }
                                        {
                                            elt.img_bank_id === props.stateImages.length ?
                                                <></> :
                                                <ImArrowRight2 className="custom-arrow" onClick={() => { handleClickRigthImage(elt, props.stateImages) }} />


                                        }
                                    </Container>
                                </Container >
                                <Container className="custom-arrows-block">
                                    <MdDeleteForever className="custom-trash" onClick={() => handleTrashClick(elt)} />
                                </Container>
                            </Container>
                        );
                } else if (elt.paragraph_content) {
                    if (!elt.deleted)
                        LayoutPage[elt.order] = (

                            <Form.Group className="custom-paragraph-form" key={elt.order}>
                                <Container className="custom-arrows-block">
                                    {

                                        elt.order === 0 ?
                                            <></> :
                                            <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                    }
                                    {

                                        elt.order === sizeContentState - 1 ?
                                            <></> :
                                            <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                    }
                                </Container>
                                <Form.Control size="md" as="textarea" value={elt.paragraph_content} rows={6} onChange={env => handleChangeParagraph(elt, env.target.value)} placeholder="Inser your paragraph here" />

                                <Container className="custom-arrows-block" >
                                    <MdDeleteForever className="custom-trash" onClick={() => handleTrashClick(elt)} />
                                </Container>
                            </Form.Group>

                        );
                }

            });
    }
    return (
        <>
            <NavBar loggedIn={props.loggedIn} doLogOut={props.doLogOut} websiteName={webSiteNameState} interfaceSetStatePageUpdate={props.interfaceSetStatePageUpdate} />
            <Container className="d-flex justify-content-end custom-page-state">
                <Badge pill bg="primary">
                    {props.page.published}
                </Badge>
            </Container>
            <Container className="custom-page-backoffice" >
                <Form className="custom-form-page-public" onSubmit={env => env.preventDefault()}>
                    <Container className="d-flex" >
                        {props.page.editable === ADMIN_VALUE ?
                            <>

                                <Container className="custom-form-page-public-sub">
                                    <Container className="d-flex justify-content-end custom-buttons">
                                        <Button variant="outline-danger" className="custom-button custom-button-cancel" onClick={(env) => { env.preventDefault(); handleDelete(props.page.page_data.page_id)/*;  props.interfaceSetDeleteState(true)*/ }} >
                                            Delete
                                        </Button>

                                        {
                                            !only_header ?


                                                <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={(env) => { env.preventDefault(); handlePublish(props.page.page_data.page_id, true, webSiteNameState, publicationDateState, authorState); props.interfaceSetStatePageUpdate(true) }}>
                                                    {isPagePublished ? "Published !" : "Publish"}
                                                </Button> :

                                                <Button variant="outline-secondary" className="custom-button custom-button-publish" onClick={(env) => { env.preventDefault(); }}>
                                                    {"Add an image or paragraph"}
                                                </Button>
                                        }
                                    </Container>

                                    <Container className="d-flex justify-content-center custom-on-submit-opiton" >
                                        {
                                            <>
                                                <Form.Select onChange={(env) => { setAuthorState(env.target.value) }}>
                                                    <option key={"a"} disabled={true}>Choose the author</option>
                                                    {
                                                        props.stateAuthors.map(
                                                            (author, index) => {
                                                                return (
                                                                    <option key={index} value={author.email}>
                                                                        {author.name} {author.email}
                                                                    </option>
                                                                );
                                                            }
                                                        )
                                                    }
                                                </Form.Select>
                                                <Form.Control placeholder="Website name" value={webSiteNameState} onChange={(env) => { setIsPagePublished(false); setWebSiteNameState(env.target.value) }} className="custom-parameter" />
                                                <Form.Control type="Date" value={publicationDateState} className="custom-parameter" placeholder="Publication date" onChange={(env) => { setPublicationDateState(env.target.value) }} />
                                            </>
                                        }
                                    </Container>
                                    {LayoutPage}
                                    <Container className="d-flex justify-content-center custom-on-submit-opiton">
                                        <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={() => handleAddHeader()} >
                                            Add header
                                        </Button>
                                        <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={() => handleAddImage()}>
                                            Add image
                                        </Button>
                                        <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={() => handleAddParagraph()}>
                                            Add paragraph
                                        </Button>
                                    </Container>
                                    <p>
                                        {props.page.page_data.author_name}
                                    </p>
                                </Container>
                            </>
                            :
                            <>

                                <Container className="custom-form-page-public-sub" >
                                    <Container className="d-flex justify-content-end custom-on-submit-opiton">
                                        <Button variant="outline-danger" className="custom-button custom-button-cancel" onClick={(env) => { env.preventDefault(); handleDelete(props.page.page_data.page_id); props.interfaceSetDeleteState(true) }} >
                                            Delete
                                        </Button>



                                        {
                                            !only_header ?



                                                <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={(env) => { env.preventDefault(); handlePublish(props.page.page_data.page_id, false, webSiteNameState, publicationDateState, " "); props.interfaceSetStatePageUpdate(true) }}>


                                                    {isPagePublished ? "Published !" : "Publish"}
                                                </Button> :

                                                <Button variant="outline-secondary" className="custom-button custom-button-publish" onClick={(env) => { env.preventDefault(); }}>
                                                    {"Add an image or paragraph"}
                                                </Button>
                                        }

                                    </Container>

                                    <Container className="d-flex justify-content-center custom-on-submit-opiton" >
                                        {
                                            <>
                                                <Form.Control type="Date" value={publicationDateState} className="custom-parameter" placeholder="Publication date" onChange={(env) => { setPublicationDateState(env.target.value) }} />
                                            </>
                                        }
                                    </Container>
                                    {LayoutPage}

                                    <Container className="d-flex justify-content-center custom-on-submit-opiton">
                                        <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={() => handleAddHeader()} >
                                            Add header
                                        </Button>
                                        <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={() => handleAddImage()}>
                                            Add image
                                        </Button>
                                        <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={() => handleAddParagraph()}>
                                            Add paragraph
                                        </Button>
                                    </Container>
                                    <p>
                                        {props.page.page_data.author_name}
                                    </p>
                                </Container>
                            </>
                        }
                    </Container>
                </Form>
            </Container>
        </>
    );



}

export default PageBackOffice;