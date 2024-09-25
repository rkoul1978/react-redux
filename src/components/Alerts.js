import React, { useEffect,useState } from 'react';
import AutoComplete from '../common/AutoComplete';
import AutoCompleteDebounce from '../common/AutoComplete_Debounce';
import {  useSelector, useDispatch, connect } from "react-redux";
import { requestCountries,requestProducts } from "../actions/AlertsAction";
import { setLoading } from "../actions/MuiAction";
import { Form, Row, Col, FormLabel,FormSelect } from 'react-bootstrap';
import SpinnerDialog from '../common/SpinnerDialog';

const Alerts = ({productData,requestProducts,setLoading,loading}) => {

  const _url  = "https://restcountries.com/v3.1/all";
  const url = "https://dummyjson.com/products";
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [preferredImages,setPreferredImages] = useState([]);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(requestCountries(_url));
    requestProducts(url);
  }, [dispatch,requestProducts]); 

  const { alertsReducer } = useSelector(
    state => state
  );

  const handleCountrySelectedCallback = (selectedCountry) =>{}
  const handleCountryResetCallback = (selectedCountry) =>{}

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  
  const handleProductSelectedCallback = (selectedProduct) =>{
    setLoading(true);
    if(selectedProduct !== null){
      setSelectedProductImages(selectedProduct.images);
      delay(500).then(()=>{
        setLoading(false);
      });
    } else {
        setSelectedProductImages([]);
        setLoading(false);
    }    
  }
  const handleProductResetCallback = (selectedProduct) =>{}

  const handleNameSelectedCallback = (selectedName) =>{
    console.log(selectedName);
  }
  const imageChange =(event) => {
    const target = event.target.selectedOptions;
    const images = [];
    for (let i = 0; i < target.length; i++) {
      images.push(target[i].value);
    } 
    setPreferredImages(images);
  }
  return (
    <div>
        <br/>
        <Form>
          <Row>
            <Col sm="1" style={{ marginTop: '0.5em', marginRight: '-2em' }}>
              <FormLabel>Country  :</FormLabel>
            </Col>
            <Col sm="2">
              <AutoComplete data='countries' loadData={alertsReducer.countryData} selectedCallback={handleCountrySelectedCallback} resetCallback={handleCountryResetCallback}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col sm="1" style={{ marginTop: '0.5em', marginRight: '-2em' }}>
              <FormLabel>Product  :</FormLabel>
            </Col>
            <Col sm="2">
              <AutoComplete data='products' loadData={productData} selectedCallback={handleProductSelectedCallback} resetCallback={handleProductResetCallback}/>
            </Col>
            <Col sm="1" style={{ marginTop: '0.5em', marginRight: '-2em' }}>
              <FormLabel>Images  :</FormLabel>
            </Col>
            <Col sm="2">
              <FormSelect onChange={ imageChange } value= { preferredImages} multiple={true}>
                  <option key="" value="">Select Images...</option>
                   { 
                      selectedProductImages.map((image,index) => ( 
                        <option key={image} value={image} /*style={{ backgroundSize: 'auto',backgroundImage:`url(${image})` }}*/>
                          Image {index+1}
                        </option>
                    ))
                   }
                </FormSelect>
              </Col>
              <Col sm="1" style={{ marginTop: '0.5em',  marginRight: '-2em' }}>
                <FormLabel>Names  :</FormLabel>
              </Col>
              <Col sm="2" style={{ marginTop: '0.7em' }}>
                <AutoCompleteDebounce data='names' selectedCallback={handleNameSelectedCallback}/>
              </Col>
          </Row>
          <br/>
          <Row>
            {
              selectedProductImages && preferredImages && selectedProductImages.map(image => (
                <Col key ={image} sm="4">
                {
                  preferredImages.includes(image) ? ( <img src={image} style={{ padding:'0px', border:'1px solid red', width:'500px', height:'400px'}} /> ) :  ( <img src={image} style={{ width:'500px', height:'400px'}}/> )
                }
                </Col>
              ))
            }
          </Row>
          {
             loading ? (
              <SpinnerDialog title='Loading Images ...'/> ):<></>
          }
        </Form>
    </div>
  );
  
}
const mapStateToProps= (state) => ({
  productData: state.alertsReducer.productData,
  loading: state.muiReducer.loading,
});
const mapDispatchToProps= (dispatch) =>({
  requestProducts: (url) => dispatch(requestProducts(url)),
  setLoading: (loading) => dispatch(setLoading(loading))
});
export default connect(mapStateToProps,mapDispatchToProps)(Alerts);

