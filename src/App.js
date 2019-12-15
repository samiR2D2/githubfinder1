import React,{Fragment}from "react"
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'

import Header from "./Components/Layout/Header"
import Users from './Components/Users/Users'
import Search from "./Components/Users/Search"
import Alert from "./Components/Layout/Alert"
import User from './Components/Users/User'

import axios from "axios"
import { setTimeout } from "timers"
import About from "./Components/Pages/About"


        class App extends React.Component{
           state={
               users:[],
               user:{},
               loading:false,
               alert:null
           };

           //Search Github users
           searchUsers= async text =>{
                this.setState({loading:true})


               const res = await axios.get(
                 `https://api.github.com/search/users?q=${text}&client_id=${
                     process.env.REACT_APP_GITHUB_CLIENT_ID
                 }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
               );

               this.setState({users:res.data.items, loading:false});
           }
   
            //Get Single Github User

            getUser=async username=>{

                 this.setState({loading:true})


       const res = await axios.get(
                 `https://api.github.com/users${username}?client_id=${
                     process.env.REACT_APP_GITHUB_CLIENT_ID
                 }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
               );

               this.setState({user:res.data, loading:false});
            }





           //Clear users from state
            clearUsers=()=>this.setState({users:[],loading:false});




            //Set Alert
            setAlert=(msg,type)=>{
              this.setState({alert:{msg,type}})
            
              setTimeout(()=>this.setState({alert:null}),3000)
              
            }


            render(){
              const {users,user,loading}=this.state
                return(
                  <Router>
                    <div className="App">
                      <Header />
                      <div className="container">
                        <Alert alert={this.state.alert}/>
                        <Switch>
                          <Route exact path="/" render={props => (
                            <Fragment>
                                 <Search 
                         searchUsers={this.searchUsers} 
                           clearUsers={this.clearUsers}
                           showClear={users.length > 0 ? true : false}
                           setAlert={this.setAlert}
                         />
                      <Users loading={loading} users={users} />
                            </Fragment>
                          )}/>
                          <Route exact path='/about' component={About}/>
                          <Route exact path='/user/:login' render ={props=>(
                            <User 
                            {...props} 
                            getUser={this.getUser} 
                            user={user} 
                            loading={loading}/>

                          )}/>
                        </Switch> 
                      </div>
                    </div>
                    </Router>
                ) 
            }
        }
export default App