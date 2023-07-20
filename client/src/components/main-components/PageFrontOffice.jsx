/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import NavBar from "../sub-components/NavBar"
import { Container, Image } from 'react-bootstrap'

function PageFrontOffice(props) {

    const LayoutPage = [];
    if (props.page.page_data) {
        props.page.page_data.content
            .forEach((elt) => {
                if (elt.header_content) {
                    LayoutPage[elt.order] = (
                        <h1 key={elt.order}>
                            {elt.header_content}
                        </h1>
                    );
                } else if (elt.img_path) {
                    LayoutPage[elt.order] = (
                        <Image src={`http://localhost:3001/static/${elt.img_path}`} key={elt.order} className="custom-img-page" />
                    );
                } else if (elt.paragraph_content) {
                    LayoutPage[elt.order] = (
                        <p key={elt.order}>
                            {elt.paragraph_content}
                        </p>
                    );
                }

            });

        return (
            <>
                <NavBar loggedIn={props.loggedIn} doLogOut={props.doLogOut} websiteName={props.page.page_data.web_site_name} interfaceSetStatePageUpdate={props.interfaceSetStatePageUpdate}/>
                <Container className="custom-page-public">
                    {LayoutPage}
                </Container>
                <p>
                    {props.page.page_data.author_name}
                </p>
            </>
        );
    }



}

export default PageFrontOffice;