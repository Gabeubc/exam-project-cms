/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState } from "react"
import NavBar from "../sub-components/NavBar"
import { Container, Image, Form, Button } from 'react-bootstrap'
import cloneDeep from 'lodash.clonedeep';
import { ImArrowLeft2, ImArrowRight2, ImArrowUp2, ImArrowDown2 } from 'react-icons/im'
import { MdDeleteForever } from 'react-icons/md'
import API from "../../common/API"
import { useNavigate } from "react-router-dom"


const ADMIN_VALUE = "admin";

function PageCreate(props) {


    const [contentState, setContentState] = useState([
        {
            p_id: " ",
            header_content: "New Header",
            order: 0,
            added: true
        }
    ]);

    const [publicationDateState, setPublicationDateState] = useState(" ");

    const [webSiteNameState, setWebSiteNameState] = useState("ORIZZONTI");

    const [isPageCreated, setIsPageCreated] = useState(false);

    const navigate = useNavigate();


    if (props.deleteState)
        navigate("/");

    async function handleDelete(id) {
        await API.DeletePage(id);
    }

    function resetContentState() {
        setContentState();
    }


    function handleTrashClick(elt) {
        const tmp = cloneDeep(elt);
        let result = [];
        let newContentState = cloneDeep(contentState);
        const updatedContentState = newContentState
            .sort((itemA, itemB) => itemA.order - itemB.order)
            .map(
                (item, index) => {
                    if (item.order == tmp.order) {
                        if (item.header_content) {
                            item.deleted = true;
                            return item;
                        }
                        if (item.img_path) {
                            item.deleted = true;
                            return item;
                        }
                        if (item.paragraph_content) {
                            item.deleted = true;
                            return item;
                        }
                    } else {
                        return cloneDeep(item);
                    }
                }
            );
        let count = 0;
        let endContent = updatedContentState.length;
        const fixOrderContent = updatedContentState
            .forEach(
                elt => {
                    if (!elt.deleted) {
                        elt.order = count++;
                        result.push(elt);
                        return elt;
                    } else {
                        return elt;
                    }
                }
            );
        setContentState(result);
        setIsPageCreated(false);
    }


    function handleChangeParagraph(elt, value) {
        const elt_copy = cloneDeep(elt);
        if (value)
            elt_copy.paragraph_content = value;
        else
            elt_copy.paragraph_content = " ";

        const newContentState = contentState.map((item, index) => {
            if (index === elt_copy.order) {
                return elt_copy;
            } else {
                return cloneDeep(item);
            }
        });

        setContentState(newContentState);
        setIsPageCreated(false);
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
        setIsPageCreated(false);

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
        setIsPageCreated(false);
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
        setIsPageCreated(false);
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
        setIsPageCreated(false);
    }



    function handleChangeHeader(elt, value) {
        const elt_copy = cloneDeep(elt);
        if (value)
            elt_copy.header_content = value;
        else
            elt_copy.header_content = " ";

        const newContentState = contentState.map((elt, index) => {
            if (index === elt_copy.order) {
                return elt_copy;
            } else {
                return cloneDeep(elt);
            }
        });

        setContentState(newContentState);
        setIsPageCreated(false);
    }



    function handleAddHeader() {
        const newContentState = cloneDeep(contentState);
        let newHeader = {
            p_id: " ",
            header_content: "New Header",
            order: newContentState.length,
            added: true
        };
        newContentState.push(newHeader);
        setContentState(newContentState);
        setIsPageCreated(false);
    }


    function handleAddParagraph() {
        const newContentState = cloneDeep(contentState);
        let newParagraph = {
            p_id: " ",
            paragraph_content: "New paragraph",
            order: newContentState.length,
            added: true
        };
        newContentState.push(newParagraph)
        setContentState(newContentState);
        setIsPageCreated(false);
    }


    function handleAddImage() {
        const newContentState = cloneDeep(contentState);
        let newImage = {
            p_id: "tmp",
            img_bank_id: props.stateImages[0].img_id,
            img_path: props.stateImages[0].img_path,
            order: newContentState.length,
            added: true
        };
        newContentState.push(newImage);
        setContentState(newContentState);
        setIsPageCreated(false);
    }

    async function handleCreate(webSiteName, publicationDate) {
        await API.CreatePage({ content: contentState, web_site_name: webSiteName, publication_date: publicationDate });
        setIsPageCreated(true);
    }

    const LayoutPage = [];
    let count_h = 0;
    contentState
        .forEach(
            (elt, index) => {
                if (elt.header_content && count_h < contentState.length)
                    count_h++;
            }
        );

    const only_header = count_h === contentState.length ? true : false;

    if (count_h < 2) {
        contentState
            .forEach((elt, index) => {
                if (elt.header_content) {
                    LayoutPage[elt.order] = (

                        <Form.Group className="custom-header-form" key={elt.order}>
                            <Container className="custom-arrows-block">
                                {
                                    elt.order === 0 ?
                                        <></> :
                                        <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                }
                                {

                                    elt.order === contentState.length - 1 ?
                                        <></> :
                                        <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                }
                            </Container>
                            <Form.Control size="lg" value={elt.header_content} onChange={env => handleChangeHeader(elt, env.target.value)} placeholder="Insert your header here" />
                        </Form.Group>

                    );
                } else if (elt.img_path) {
                    LayoutPage[elt.order] = (
                        <Container className="custom-img-container" key={elt.order}>
                            <Container className="custom-arrows-block">
                                {
                                    elt.order === 0 ?
                                        <></> :
                                        <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                }
                                {

                                    elt.order === contentState.length - 1 ?
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
                            </Container>
                        </Container>
                    );
                } else if (elt.paragraph_content) {
                    LayoutPage[elt.order] = (

                        <Form.Group className="custom-paragraph-form" key={elt.order}>
                            <Container className="custom-arrows-block">
                                {

                                    elt.order === 0 ?
                                        <></> :
                                        <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                }
                                {

                                    elt.order === contentState.length - 1 ?
                                        <></> :
                                        <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                }
                            </Container>
                            <Form.Control size="md" as="textarea" value={elt.paragraph_content} rows={6} onChange={env => handleChangeParagraph(elt, env.target.value)} placeholder="Insert Your Paragraph here" />
                        </Form.Group>

                    );
                }

            })
    } else {
        contentState
            .forEach((elt, index) => {
                if (elt.header_content) {
                    LayoutPage[elt.order] = (

                        <Form.Group className="custom-header-form" key={elt.order}>
                            <Container className="custom-arrows-block">
                                {
                                    elt.order === 0 ?
                                        <></> :
                                        <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                }
                                {

                                    elt.order === contentState.length - 1 ?
                                        <></> :
                                        <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                }
                            </Container>
                            <Form.Control size="lg" value={elt.header_content} onChange={env => handleChangeHeader(elt, env.target.value)} placeholder="Insert your header here" />

                            <Container className="custom-arrows-block">
                                <MdDeleteForever className="custom-trash" onClick={() => handleTrashClick(elt)} />
                            </Container>
                        </Form.Group>

                    );
                } else if (elt.img_path) {
                    LayoutPage[elt.order] = (
                        <Container className="custom-img-container" key={elt.order}>
                            <Container className="custom-arrows-block">
                                {
                                    elt.order === 0 ?
                                        <></> :
                                        <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                }
                                {

                                    elt.order === contentState.length - 1 ?
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
                            </Container>
                            <Container className="custom-arrows-block" >
                                <MdDeleteForever className="custom-trash" onClick={() => handleTrashClick(elt)} />
                            </Container>
                        </Container>
                    );
                } else if (elt.paragraph_content) {
                    LayoutPage[elt.order] = (

                        <Form.Group className="custom-paragraph-form" key={elt.order}>
                            <Container className="custom-arrows-block">
                                {

                                    elt.order === 0 ?
                                        <></> :
                                        <ImArrowUp2 className="custom-arrow" onClick={() => handleUpClickElt(elt)} />
                                }
                                {

                                    elt.order === contentState.length - 1 ?
                                        <></> :
                                        <ImArrowDown2 className="custom-arrow" onClick={() => handleDownClickElt(elt)} />
                                }
                            </Container>
                            <Form.Control size="md" as="textarea" value={elt.paragraph_content} rows={6} onChange={env => handleChangeParagraph(elt, env.target.value)} placeholder="Insert Your Paragraph here" />
                            <Container className="custom-arrows-block" >
                                <MdDeleteForever className="custom-trash" onClick={() => handleTrashClick(elt)} />
                            </Container>
                        </Form.Group>

                    );
                }

            })
    }
    return (
        <>
            <NavBar loggedIn={props.loggedIn} doLogOut={props.doLogOut} websiteName={webSiteNameState} resetContentState={resetContentState} interfaceSetStatePageUpdate={props.interfaceSetStatePageUpdate} />
            <Container className="d-flex justify-content-end custom-page-state">
                {""}
            </Container>
            <Container className="custom-page-backoffice" >
                <Form className="custom-form-page-public" onSubmit={env => env.preventDefault()}>
                    <Container className="d-flex" >
                        {
                            <>

                                <Container className="custom-form-page-public-sub" >
                                    <Container className="d-flex justify-content-end custom-on-submit-opiton">
                                        <Button variant="outline-secondary" className="custom-button custom-button-cancel" onClick={(env) => { navigate("/") }} >
                                            Home
                                        </Button>
                                        {
                                            !only_header ?

                                                <Button variant="outline-primary" className="custom-button custom-button-publish" onClick={(env) => { env.preventDefault(); handleCreate(webSiteNameState, publicationDateState); props.interfaceSetStatePageUpdate(true) }}>
                                                    {isPageCreated ? "Published !" : "Publish"}
                                                </Button> :

                                                <Button variant="outline-secondary" className="custom-button custom-button-publish" onClick={(env) => { env.preventDefault();}}>
                                                    {"Add an image or paragraph"}
                                                </Button>
                                        }
                                    </Container>

                                    <Container className="d-flex justify-content-center custom-on-submit-opiton" >
                                        {
                                            <>
                                                <Form.Control placeholder="Insert your page name" onChange={(env) => { setIsPageCreated(false); setWebSiteNameState(env.target.value) }} className="custom-parameter" />
                                                <Form.Control type="Date" className="custom-parameter" value={publicationDateState} placeholder="Publication date" onChange={(env) => { setPublicationDateState(env.target.value) }} />
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
                                </Container>
                            </>
                        }
                    </Container>
                </Form>
            </Container>
        </>
    );




}

export default PageCreate;