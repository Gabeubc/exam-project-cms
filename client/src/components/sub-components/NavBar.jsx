/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Container, Navbar, Button } from 'react-bootstrap'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';


function NavBar(props) {

    const navigate = useNavigate();
    return (
        <>
            <Navbar bg="light" expand="lg" className=' fixed-top custom-navbar'>
                <Container >
                    <Navbar.Brand href="#home" className='custom-brand-name'onClick={env => { env.preventDefault(); navigate("/"); props.interfaceSetStatePageUpdate(true);}}>
                        <Container>
                    <Button variant="outline-dark" className='custom-buttom-homepage'>{props.websiteName ? props.websiteName : "ORIZZONTI"}</Button> 
                        </Container>
                    </Navbar.Brand>
                    <div className='d-flex flex-column custom-container-login' onClick={ () => { !props.loggedIn ? navigate("/api/login") : navigate("/"); props.doLogOut()} } >
                         { props.loggedIn ? <FiLogOut className='custom-login-icon' />  :  <FiLogIn className='custom-login-icon' /> }
                         { props.loggedIn ? "Logout" : "Login" }
                    </div>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;