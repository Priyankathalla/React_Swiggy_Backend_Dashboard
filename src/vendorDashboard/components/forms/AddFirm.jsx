import React, { useState } from 'react'
import {API_URL} from '../../data/apiPath';

const AddFirm = () => {

   const [firmName, setFirName]= useState("");
   const [area, setArea]= useState("");
   const [category, setCategory]= useState([]);
   const [region, setRegion]= useState([]);
   const [offer, setOffer]= useState("");
   const [file, setFile]= useState(null);

   const handleCategoryChange = (event) =>{
      const value = event.target.value;
      if(category.includes(value)){
        setCategory(category.filter((item)=>item !== value));
      }
      else{
         setCategory([...category, value])
      }
   }

   const handleRegionChange = (event) =>{
      const value = event.target.value;
      if(region.includes(value)){
         setRegion(region.filter((item) => item !== value));
      }else{
         setRegion([...region, value])
      }
   }

   const handleImageUpload = (event) =>{
      const selectedImage = event.target.files[0]
      setFile(selectedImage)
   }

   const handleFirmSubmit = async(e)=>{
      e.preventDefault();

      try {

        const loginToken = localStorage.getItem('loginToken');
        if(!loginToken){
         console.error("User not Authenticated")
         return;
        }

        const formData = new FormData();
        formData.append('firmName', firmName);
        formData.append('area', area);
        formData.append('offer', offer);
        formData.append('image', file);

        category.forEach((value)=>{
            formData.append('category', value)
        })

        region.forEach((value)=>{
            formData.append('region', value)
        })

        const response = await fetch(`${API_URL}/firm/add-firm`, {
            method:'POST',
            headers :{
               'token' : `${loginToken}`
            },
            body : formData
        })

        const data = await response.json()

        if(response.ok){

            alert('Firm added Successfully')

            // ✅ Store firmId
            if(data.firmId){
               localStorage.setItem('firmId', data.firmId)
            }

            // ✅ Store firmName (IMPORTANT FIX)
            localStorage.setItem('firmName', firmName)

            // ✅ Dispatch custom event to hide AddFirm immediately
            window.dispatchEvent(new Event("firmAdded"))

            // Reset form
            setFirName("")
            setArea("")
            setCategory([])
            setRegion([])
            setOffer("")
            setFile(null)

        } 
        else if(data.message === "vendor can have only one firm"){
            alert("Firm exists ,Only 1 firm can be added")
        } 
        else{
            alert("Failed to add firm")
        }

      } catch (error) {
         console.error("Failed to add firm")
      }
   }


  return (
    <div className="firmSection">
        <form className="tableForm" onSubmit={handleFirmSubmit} >
            <h3>Add Firm</h3>

            <label> Firm Name </label >
            <input 
              type="text" 
              name='firmName' 
              value={firmName} 
              onChange={(e)=>setFirName(e.target.value)}
            />
            <br />

            <label> Area</label>
            <input 
              type="text" 
              name='area' 
              value={area} 
              onChange={(e)=>setArea(e.target.value)} 
            />
            <br />

            <div className="checkInp">
              <label>Category:</label>
                <div className="inputsContainer">
                   <div className="checkBoxContainer">
                      <label>Veg</label>
                      <input 
                        type="checkbox" 
                        checked={category.includes('veg')} 
                        value="veg" 
                        onChange={handleCategoryChange} 
                      />
                   </div>

                   <div className="checkBoxContainer">
                      <label>Non-Veg</label>
                      <input 
                        type="checkbox" 
                        checked={category.includes('non-veg')} 
                        value="non-veg" 
                        onChange={handleCategoryChange} 
                      />
                   </div>
                </div>
            </div>

            <br />

            <div className="checkInp">
              <label>Region:</label>
                <div className="inputsContainer">

                   <div className="regBoxContainer">
                      <label>South-Indian</label>
                      <input 
                        type="checkbox" 
                        checked={region.includes('south-indian')} 
                        value="south-indian" 
                        onChange={handleRegionChange} 
                      />
                   </div>

                   <div className="regBoxContainer">
                      <label>North-Indian</label>
                      <input 
                        type="checkbox" 
                        checked={region.includes('north-indian')} 
                        value="north-indian" 
                        onChange={handleRegionChange} 
                      />
                   </div>

                   <div className="regBoxContainer">
                      <label>Chinese</label>
                      <input 
                        type="checkbox" 
                        checked={region.includes('chinese')} 
                        value="chinese" 
                        onChange={handleRegionChange} 
                      />
                   </div>

                   <div className="regBoxContainer">
                      <label>Bakery</label>
                      <input 
                        type="checkbox" 
                        checked={region.includes('bakery')} 
                        value="bakery" 
                        onChange={handleRegionChange} 
                      />
                   </div>

                </div>
            </div>

            <br />

            <label> Offer</label>
            <input 
              type="text" 
              name='offer'
              value={offer} 
              onChange={(e)=>setOffer(e.target.value)} 
            />

            <br /> 

            <label> Image </label>
            <input type="file" onChange={handleImageUpload} /> 

            <br />

            <div className="btnSubmit">
                <button type='submit'>Submit</button>
            </div>

        </form>
    </div>
  )
}

export default AddFirm