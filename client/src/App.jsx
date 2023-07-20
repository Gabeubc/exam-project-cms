/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import PageCards from './components/main-components/PageCards'
import PageCardsBackOffice from './components/main-components/PageCardsBackOffice'
import PageFrontOffice from './components/main-components/PageFrontOffice'
import PageBackOffice from './components/main-components/PageBackOffice'
import PageCreate from './components/main-components/PageCreate'
import API from './common/API'
import { LoginForm } from './components/main-components/LoginForm'



const ADMIN_VALUE = "admin"

const EDITABLE = "editable"

function App() {

  const [statePages, setStatePages] = useState([]);
  const [statePage, setStatePage] = useState({});
  //const [statePageId, setStatePageId] = useState();
  const [statePageUpdate, setStatePageUpdate] = useState(true);
  const [stateAuthors, setStateAuthors] = useState([]);
  const [stateImages, setStateImages] = useState([]);
  const [stateImgPaths, setImgPaths] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [pageUpdatePayloadAdminState, setPageUpdatePayloadAdminState] = useState();


  function interfaceSetDeleteState(bool) {
    setDeleteState(bool)
  }


  function interfaceSetStatePageUpdate(bool) {
    setStatePageUpdate(bool)
  }

  function interfaceSetStatePage(page) {
    setStatePage(page)
  }
  


  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    setStatePageUpdate(true);
    setStateAuthors([]);
  }


  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setStatePageUpdate(true);  
  }





  useEffect(() => {


    if (loggedIn) {
      if (statePageUpdate) {
        API.fetchPagesBackOffice()
          .then(
            pages => {
              setStatePages(pages);
            }
          );
        API.fetchImages()
          .then(
            images => { setStateImages(images) }
          );

        API.fetchAuthors()
          .then(
            authors => { setStateAuthors(authors) }
          );
        setStatePageUpdate(false);
      }

    } else {
      API.fetchPages()
        .then(
          pages => {
            setStatePages(pages);
          }
        );
      setStatePageUpdate(false);
    }
  }, [statePageUpdate]);


  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={
            loggedIn ?
              <PageCardsBackOffice
                pages={statePages}
                deleteState={deleteState}
                interfaceSetDeleteState={interfaceSetDeleteState}
                loggedIn={loggedIn}
                doLogOut={doLogOut}
                interfaceSetStatePage={interfaceSetStatePage}
              /> :
              < PageCards
                pages={statePages}
                deleteState={deleteState}
                interfaceSetDeleteState={interfaceSetDeleteState}
                loggedIn={loggedIn}
                doLogOut={doLogOut}
                interfaceSetStatePage={interfaceSetStatePage}
              />
          }
          />
          <Route path='/api/page'
            element={
              loggedIn && statePage.editable ? (
                <PageBackOffice
                  page={statePage}
                  deleteState={deleteState}
                  interfaceSetDeleteState={interfaceSetDeleteState}
                  stateImages={stateImages}
                  stateAuthors={stateAuthors}
                  loggedIn={loggedIn}
                  doLogOut={doLogOut}
                  interfaceSetStatePageUpdate={interfaceSetStatePageUpdate}
                  stateImgPaths={stateImgPaths}
                />
              ) : ( 
                <PageFrontOffice
                  page={statePage}
                  loggedIn={loggedIn}
                  interfaceSetStatePageUpdate={interfaceSetStatePageUpdate}
                  doLogOut={doLogOut}
                />
              )


            }
          />
          <Route path='/api/login' element={
            loggedIn ?
              <Navigate replace to='/' /> :
              <LoginForm loginSuccessful={loginSuccessful} interfaceSetStatePageUpdate={interfaceSetStatePageUpdate} />
          }
          
          interfaceSetStatePageUpdate={interfaceSetStatePageUpdate}
          />
          <Route path='/api/page/create'
            element={
              loggedIn && stateImages ?
                <PageCreate
                  stateAuthors={stateAuthors}
                  stateImages={stateImages}
                  loggedIn={loggedIn}
                  doLogOut={doLogOut}
                  interfaceSetStatePageUpdate={interfaceSetStatePageUpdate}
                  stateImgPaths={stateImgPaths}
                /> :
                <></>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
