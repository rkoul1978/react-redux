import React, { useEffect } from 'react';
import { useSelector, useDispatch, connect } from "react-redux";
import { requestUsers } from "../actions";


const Departments= ({usersData,requestUsers}) => { 
  
    const { usersReducer } = useSelector(
      state => state
    ); 
  
  //  const dispatch = useDispatch();
    const url = "https://jsonplaceholder.typicode.com/users";
   
   /* useEffect(() => {
      dispatch(requestUsers(url));
    }, [dispatch]);*/
    useEffect(() => {
      requestUsers(url);
    }, [requestUsers])
  
    
    return (
      <>
        {
          usersReducer.isLoading && 
            <div>
              Data loading...
            </div>
        }
        {
          usersReducer.isError && 
            <div>
              Error loading data: { usersReducer.errorMsg }
            </div>
        }

        {
          ! usersReducer.isLoading && ! usersReducer.isError && 
          (
            <div>
              <h4 id="title">Users</h4>
              <table id="users">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Company</th>
                  </tr>
                </thead>
                <tbody>
                  {
                      usersData.map(user => 
                        {
                          return (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.address.street}</td>
                              <td>{user.company.name}</td>
                            </tr>
                          )
                      })
                  }
                </tbody>
              </table>
            </div>
          )
        }

      </>
    );
  
}
const mapStateToProps= (state) => ({
    usersData: state.usersReducer.usersData 
});

const mapDispatchToProps = (dispatch) =>({
    requestUsers: (url) => dispatch(requestUsers(url))
});

export default connect(mapStateToProps,mapDispatchToProps)(Departments) ;

