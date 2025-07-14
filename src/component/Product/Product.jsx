import React, { useState, useRef,useEffect} from 'react';
import axios from 'axios';
import { Row, Col, Button, Form, Modal, Table,Pagination} from 'react-bootstrap';
import { BsGrid1X2Fill } from 'react-icons/bs';
import Sidebar from '../../assets/Sidebar';
import Header from '../../assets/Header';
import { FaRegEdit } from "react-icons/fa";
import api from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CreatableSelect from 'react-select/creatable';



function Product() {
   const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
   
  },
};
 const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
   const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
  
    name:"",
    category:"",
   price:"",
   stock:"",
   title:"",
   product_image:"",
     short_description:"",
       long_description:"",
       tag: []

  });
  
  const [productData, setProductData] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);
  useEffect(() => {
  setTagOptions([
    { label: "spa", value: "spa" },
    { label: "healthy", value: "healthy" },
    { label: "facial", value: "facial" },
  ]);
}, []);
const handleTagChange = (selected) => {
  setNewProduct({ ...newProduct, tag: selected.map(item => item.value) });
};

  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleClose = () => {
    setShow(false);
    setEditProductId(null);
    setNewProduct({
           name:"",
    category:"",
   price:"",
   stock:"",
   title:"",
   product_image:"",
     short_description:"",
       long_description:"",
        tag: [] 

    });
    setImage(null);
  };

  const handleShow = () => setShow(true);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      const uploadedImage = reader.result;
      setImage(uploadedImage);
      console.log(uploadedImage);
      setNewProduct({ ...newProduct, product_image: file });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
 


  
  
  const handleAddproduct =async () => {
    const { name,category,price,stock,title,product_image,short_description,long_description } = newProduct;
    if (editProductId !== null) {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('title', title);
      formData.append('product_image', product_image);
        formData.append('short_description', short_description);
          formData.append('long_description', long_description);
           formData.append('tag', newProduct.tag.join(','));

          console.log("category",category);
          
      api.put(`/products/${editProductId}`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
    
      const formData = new FormData();
   formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('title', title);
      formData.append('product_image', product_image);
        formData.append('short_description', short_description);
          formData.append('long_description', long_description);
            formData.append('tag', newProduct.tag.join(','));

     console.log("formData",category);
     
      api.post("/products", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
.then(response=>{
  console.log("data------------>",response.data
    );
  fetchData();
}
  )
  .catch(error => {
    console.error('Error:', error);
  });
    }

    handleClose();
  };
  useEffect(() => {
    console.log("product data:", productData);
    fetchData();
  }, []);
  const fetchData = async() => {
api.get(`/products`)
        .then(response => {
          console.log("response===========>",response.data);
          const productListWithIds = response.data.map((product, index) => ({
            ...product,
            sno: index + 1,
          }));
        
          setProductData(productListWithIds);
      
        })
        .catch(err => {
          console.error("Error fetching data:", err);
        });
    };
  const handleEditproduct =async (id) => {
    console.log("edit id =======>",id);
    
    api.get(`/products/${id}`)
    .then(response => {
      console.log(response.data) 
      const productToEdit = response.data;
      const productimg = response.data.product_image;
      console.log("productimg",productimg);
      setEditProductId(id);
      setNewProduct({
        id: productToEdit._id,
        name: productToEdit.name,
        category: productToEdit.category,
        price: productToEdit.price,
        stock: productToEdit.stock,
          tag: Array.isArray(productToEdit.tag)
    ? productToEdit.tag
    : productToEdit.tag?.split(',').map((t) => t.trim()) || [],
        title: productToEdit.title,
        product_image: productToEdit.product_image,
         short_description: productToEdit.short_description,
          long_description: productToEdit.long_description
      });
    
      setImage(productToEdit.image);

        handleShow();
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  };

  
  const handleDeleteproduct =  async(id) => {
    api.delete(`/products/${id}`)
      .then(response => {
        console.log("product deleted successfully" + response.data);
        const updatedproductData = productData.filter((product) => product._id !== id);
        setProductData(updatedproductData.map((product, index) => ({
          ...product,
          sno: index + 1 // Update sno based on current index
        })));
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };
  const imagePath="http://localhost:5000";
  return (
    <>
      <div className="wrapper d-flex align-items-stretch">
       <Sidebar/>
        <div id="content" className="p-4 p-md-5">
      <Header/>
          <h2 className="mb-4">products</h2>
          <Row>
            <Col md={{ span: 5, offset: 5 }}>
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback" />
                <input type="text" className="form-control" placeholder="Search" onChange={(e) => setQuery(e.target.value)} />
              </div>
            </Col>
            <Col md={{ span: 0, offset: 0 }}>
              <Button variant="primary" onClick={handleShow}>
                <BsGrid1X2Fill className="icon" /> Add product
              </Button>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose} id='addproduct'>
            <div className="modal-contents">
              <Modal.Header id="addprod">
                <Modal.Title style={{ color: '#fff' }}>{editProductId ? 'Edit product' : 'Add product'}</Modal.Title>
                <Button style={{ visibility: 'hidden' }} variant="secondary" onClick={handleClose}>
                  X
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  X
                </Button>
              </Modal.Header>
              
              <div className="row" style={{display:'block',margin:'auto'}}>
              <div className="col-xs-12 col-sm-12">
                  <div className="box">
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        border: '2px solid #ccc',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        margin: '7px auto',
                        position: 'relative',
                        background:'#fff',
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      {!image && (
                      <button
                        onClick={handleButtonClick}
                        style={{
                          position: 'absolute',
                          bottom: '30px',
                          left: '50%',
                          color: '#000',
                          transform: 'translateX(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Upload Image
                      </button>
                      )}
                      {image ? (
                        <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      ) : (
                        <img src={imagePath+newProduct.product_image} alt="default" style={{ maxWidth: '50%', maxHeight: '50%' }} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12">
                  <div className="box">
                    <Form style={{ color: '#fff' }}>
                      <Form.Group className="mb-3" >
                        <Form.Label>Product Name </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={newProduct.name}
                          name="productname"
                          value={newProduct.name}
                          id="productname"
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="form"
                        
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" >
                        <Form.Label>Category </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={newProduct.category}
                          name="category"
                          value={newProduct.category}
                          id="category"
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="form"
                        
                        />
                      </Form.Group>
                    
                      <Form.Group className="mb-3" >
                        <Form.Label>Price </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder=""
                          name="price"
                          id="price"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="form"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" >
                        <Form.Label>Stock </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder=""
                          name="stock"
                          id="stock"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="form"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
  <Form.Label>Tags</Form.Label>
  <CreatableSelect
    isMulti
    value={newProduct.tag.map(t => ({ label: t, value: t }))}
    onChange={handleTagChange}
    options={tagOptions}
    placeholder="Enter or select tags"
  />
</Form.Group>

                       <Form.Group className="mb-3" >
                        <Form.Label>Title </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={newProduct.title}
                          name="title"
                          value={newProduct.title}
                          id="title"
                          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                          className="form"
                        
                        />
                      </Form.Group>
                        <Form.Group className="mb-3" >
                        <Form.Label>Short description</Form.Label>
                        <Form.Control as="textarea" aria-label="With textarea"
                       
                       value={newProduct.short_description}
                       onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                         />
                      </Form.Group>
                    
                     
                   <Form.Group className="mb-3">
  <Form.Label>Long description</Form.Label>
<ReactQuill
 
    value={newProduct.long_description || ""}
    onChange={(value) =>
      setNewProduct({ ...newProduct, long_description: value })
    }
    theme="snow"
    modules={modules}
    placeholder="Enter product details here..."
    style={{ height: '200px', marginBottom: '20px' }}
  />
</Form.Group>

                    </Form>
                    
                  </div>
                </div>
               
              </div>
              <Modal.Footer>
             
                <Button variant="primary" onClick={handleAddproduct}>
                  {editProductId ? 'Save' : 'Add'}
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
          <Table responsive style={{color:'#fff',marginTop:'1rem'}}  >
            <thead style={{background:'#393938'}}>
              <tr>
                <th>Sno</th>
                <th>Image</th>
                <th>Product name</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              {currentItems
              .filter(item => {
                const lowercaseQuery = query.toLowerCase();
                return(
                  item?.name && item.name.toLowerCase().startsWith(lowercaseQuery)||
                  item?.category && item.category.toLowerCase().startsWith(lowercaseQuery)
                ) 

              })
              .map((product,index) => (
                <tr key={index+1}>
                  <td>{index+1}</td>
            
<td>
<img
        src={imagePath +  product?.product_image}
        alt={product?.name}
        style={{ width: '50px', height: '50px' }}
      />
    
</td>

                  {/* <td>
                    <img src={product.product_image} alt={product.product_name} style={{ width: '50px', height: '50px' }} />
                  </td> */}
                  <td ><p class="productpara">{product.name}</p></td>
                  <td><p class="productpara">{product.category}</p></td>
               
                  <td>
                  {/* <FaRegEdit  onClick={() => handleEditproduct(product._id)}/> */}
                    <Button variant="primary" onClick={() => handleEditproduct(product._id)}>Edit</Button>
                    <Button variant="danger" className="butdang" id="dan"  onClick={() => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      handleDeleteproduct(product._id);
    }
  }}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
  
          <Pagination>
            <Pagination.First onClick={() => paginate(1)} />
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
          
            {[...Array(Math.ceil(productData.length / itemsPerPage)).keys()].map((number) => (
              <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} />
            <Pagination.Last onClick={() => paginate(Math.ceil(productData.length / itemsPerPage))} />
          </Pagination>
        </div>
      </div>
    </>
  );
}

export default Product