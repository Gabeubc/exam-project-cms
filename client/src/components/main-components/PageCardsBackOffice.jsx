/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card, Row, Col } from 'react-bootstrap'
import NavBar from '../sub-components/NavBar';
import API from '../../common/API';




function PageCardsBackOffice(props) {

    const navigate = useNavigate();
    if (props.deleteState)
        props.interfaceSetDeleteState(false);


    function HandleClickToPage(id) {
        API.fetchBackOfficePage(id)
            .then(
                page => {
                    props.interfaceSetStatePage(page);
                    navigate("/api/page");
                }
            );
    }


    return (
        <>
            <NavBar loggedIn={props.loggedIn} doLogOut={props.doLogOut} interfaceSetStatePageUpdate={props.interfaceSetStatePageUpdate}/>
            {
                props.loggedIn ?

                    <Container className='custom-container-button d-flex justify-content-end'>
                        <Button variant="outline-primary" key="4" className="custom-button custom-button-create" onClick={(env) => { env.preventDefault(); navigate('/api/page/create') }}>Create</Button>
                    </Container> :
                    <></>
            }
            <Container className='custom-feed-container'>
                <Row xs={1} md={2} className="g-4">
                    {props.pages.map((page, idx) => (
                        <Col key={idx} >
                            <Card style={{ width: '18rem' }} className="custom-card">
                                <Card.Body className='custom-card-body'>
                                    <Card.Title className='custom-card-header'>{page.page_data.web_site_name}</Card.Title>

                                    <Button variant="primary" onClick={() => { HandleClickToPage(page.page_data.page_id); }} className='custom-card-read-more'>Read more</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default PageCardsBackOffice;