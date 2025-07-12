import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { Row, Col, Button, Modal, Table,Pagination, } from 'react-bootstrap';
import { BsGrid1X2Fill } from 'react-icons/bs';
import Header from '../../assets/Header';
import Sidebar from '../../assets/Sidebar';
import Form from 'react-bootstrap/Form';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import { emailValidator, passwordValidator } from '../../comp/RegexValidator';
import api from '../../services/api';
function Admin() {
 
  const[show,setShow]=useState(false); 
  const handleShow = () => setShow(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [newAdmin, setNewAdmin] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    pwd: '',
    cnfpwd:'',
    added: '',
  });
  const [password, setPassword] = useState("");
 
const [type, setType] = useState('password');
const [icon, setIcon] = useState(eyeOff);
const handleToggle = () => {
   if (type==='password'){
      setIcon(eye);
      setType('text')
   } else {
      setIcon(eyeOff)
      setType('password')
   }
} 
const [adminData, setAdminData] = useState([]);
const[editAdminId,setEditAdminId]=useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);
const [query, setQuery] = useState("");
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = adminData.slice(indexOfFirstItem, indexOfLastItem);
const paginate = (pageNumber) => setCurrentPage(pageNumber);
const handleClose = () => {
  setShow(false);
  setEditAdminId(null);
  setNewAdmin({
    id: '',
  name: '',
  email: '',
  phone: '',
  pwd: '',
  cnfpwd:'',
  added: '',
  });

};

const handleAddAdmin=async()=>{
  const { name, phone, email,role, pwd,cnfpwd} = newAdmin;
  // Check if password and confirm password match
  if (pwd !== cnfpwd) {
    // Set passwordsMatch to false if passwords don't match
    setPasswordsMatch(false);
    console.log("Passwords do not match");
    return;
  } else {
    // Reset passwordsMatch to true if passwords match
    setPasswordsMatch(true);
  }
  
  if (editAdminId !== null) {
    
    api.put(`/users/${editAdminId}`, {
   name: name,
      email: email,
      phone: phone,
      password: pwd,
      role:role,
    })
    .then(response => {
      fetchData(); // Fetch updated product list
      console.log("Success", response.data);
      handleClose();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  } else {

  api.post("/users", {
      name: name,
      email: email,
      phone: phone,
      password: pwd,
      role:role,
   
    })
    .then(response=>{
      console.log(response.data
        );
      setAdminData(prevData => [response.data, ...prevData]);
        handleClose();
    }
      )
      .catch(error => {
        console.error('Error:', error);
      });
   
  }

}
useEffect(() => {
  console.log("Admin data:", adminData);
  fetchData();
}, []);
const fetchData = async() => {
  api.get(`/users`)
      .then(response => {
        const adminListWithIds = response.data.map((admin, index) => ({
          ...admin,
          sno: index + 1,
        }));
      
        setAdminData(adminListWithIds);
    
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  };
const handleEditAdmin =async (id) => {
 api.get(`/users/${id}`)
  .then(response => {
    console.log(response.data) 
    const adminToEdit = response.data;
    console.log(adminToEdit);
    setEditAdminId(id);
    setNewAdmin({
      id: adminToEdit._id,
      name: adminToEdit.name,
      email: adminToEdit.email,
      phone: adminToEdit.phone,
      pwd: adminToEdit.password || '', 
cnfpwd: adminToEdit.password || '',
      role:adminToEdit.role,
    });
  

      handleShow();
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
    });
};


const handleDeleteAdmin = async(id) => {
api.delete(`/users/${id}`)
      .then(response => {
        console.log("User deleted successfully" + response.data);
        const updateduserData = adminData.filter((user) => user._id !== id);
        setAdminData(updateduserData.map((user, index) => ({
          ...user,
          sno: index + 1 // Update sno based on current index
        })));
      })
      .catch(error => {
        console.error('Error deleting Offer:', error);
      });
};



  return (
    <>
      <div className="wrapper d-flex align-items-stretch">
       <Sidebar/>
        <div id="content" className="p-4 p-md-5">
        <Header/>
          <h2 className="mb-4">Admin</h2>
          <Row>
            <Col md={{ span: 5, offset: 5 }}>
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback" />
                <input type="text" className="form-control" placeholder="Search" onChange={(e) => setQuery(e.target.value)} />
              </div>
            </Col>
            <Col md={{ span: 0, offset: 0 }}>
              <Button variant="primary" onClick={handleShow}>
                <BsGrid1X2Fill className="icon" /> Add Admin
              </Button>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose} >
            <div className="modal-contents"  style={{ padding:'32px' }}>
              <Modal.Header id="addprod">
                <Modal.Title style={{ color: '#fff' }}>{editAdminId ? 'Edit Admin' : 'Create Admin'}</Modal.Title>
                <Button style={{ visibility: 'hidden' }} variant="secondary">
                  X
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  X
                </Button>
              </Modal.Header>
              <Form style={{ color: '#fff' }}>
                      
                     
                      <Form.Group className="mb-3" >
                        
                        <Form.Control style={{ color: '#000',background:'#fff' }}
                          type="text"
                          placeholder="Name"
                          className="form"
                          value={newAdmin.name}
                          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" >
                        
                        <Form.Control style={{ color: '#000',background:'#fff' }}
                          type="email"
                          placeholder="Email"
                          className="form"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        />
                      </Form.Group>
                     
                      <Form.Group className="mb-3" >
                         
                        <Form.Control style={{ color: '#000',background:'#fff' }}
                          type="number"
                          placeholder="Phone"
                          className="form"
                          value={newAdmin.phone}
                          onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                          maxLength="10"
                        />
                      </Form.Group>
                    
                      <Form.Group className="mb-3" style={{position:'relative'}}>
                        
                        <Form.Control style={{color: '#000',background:'#fff'}}
                          type={type}
                          placeholder="Password"
                          className="form"
                          value={newAdmin.pwd}
                          onChange={(e) => setNewAdmin({ ...newAdmin, pwd: e.target.value })}
                        />
                        <span className="flex justify-around items-center" onClick={handleToggle}>
                  <Icon className="absolute mr-10" icon={icon} size={25} style={{position:'absolute',marginRight:'20px', top: '19.4%',   right: '5%',color:'#000'}}/>
              </span>
                      </Form.Group>
                      
                   
                      <Form.Group className="mb-3">
                        
                        <Form.Control style={{ color: '#000',background:'#fff' }}
                          type="password"
                          placeholder="Confirm Password"
                          className="form"
                          value={newAdmin.cnfpwd}
                          onChange={(e) => setNewAdmin({ ...newAdmin, cnfpwd: e.target.value })}
                        />
                     {!passwordsMatch && (
    <div style={{ color: 'red' }}>Passwords do not match</div>
  )}
                      </Form.Group>
                         <Form.Group className="mb-3" >
                        
                      <Form.Select
  style={{ color: '#000', background: '#fff' }}
  className="form"
  value={newAdmin.role}
  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
>
  <option value="">Select Role</option>
  <option value="admin">Admin</option>
  <option value="manager">Manager</option>
</Form.Select>
                      </Form.Group>
                    </Form>
              <Modal.Footer>
                <Button variant="primary" onClick={handleAddAdmin} >
                 {editAdminId ? 'Save' : 'Create Admin'}
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
          <Table responsive style={{color:'#fff',marginTop:'1rem'}}  >
            <thead style={{background:'#393938'}}>
            
              <tr>
                <th>S No</th>
                <th>Name</th>
                <th> Email</th>
                <th>Phone No</th>
              
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
      {currentItems
        .filter(item => {
          const lowercaseQuery = query.toLowerCase();
          return (
            item.name.toLowerCase().startsWith(lowercaseQuery) ||
            item.email.toLowerCase().includes(lowercaseQuery)||item.phone.toString().includes(query)
          );
        })
      .map((user, index) => (
        <tr key={index+1}>
          <td>{indexOfFirstItem + index + 1}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.phone}</td>
       
          <td style={{padding:'8px 0'}}>
                   <div className="btngrp"  style={{background:'#393938',border:'0.5px solid #979797',width:'60%',textAlign:'center',borderRadius:'12px'}}>
                   <Button onClick={() => handleEditAdmin(user._id)} className='hover' style={{background:'#393938',border:'none',borderRight:'0.5px solid #fff'}}><img src='/images/pencil-write.png' alt="" /></Button>
                       <Button 
                       onClick={() => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      handleDeleteAdmin(user._id);
    }
  }}
                     
                       style={{background:'#393938',marginLeft:'0',border:'none'}} 
                       className="butdang hover" >
                       <img src='/images/bin.png' alt="" />
                       </Button>
                   </div>
                  </td>
        </tr>
      ))}
    </tbody>
          
          </Table>
          <Pagination>
            <Pagination.First onClick={() => paginate(1)} />
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
          
            {[...Array(Math.ceil(adminData.length / itemsPerPage)).keys()].map((number) => (
              <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} />
            <Pagination.Last onClick={() => paginate(Math.ceil(adminData.length / itemsPerPage))} />
          </Pagination>
        </div>
      </div>
    </>
  );
}

export default Admin;

