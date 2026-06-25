import {useState,useEffect} from 'react';
import axios from "../../api/axios.js";
import Category from "../Category.jsx";
import RestaurantCard from './RestaurantCard.jsx';
import "../../css/home/Restaurantlist.css";

export default function RestaurantList() {
const [rest,setrest] = useState([]);

useEffect(() => {

    async function fetchrest(){
      try{ const res = await axios.get(`/restaurants`);
    setrest(res.data);}
    catch(err){
        console.log(err);
    }
    }

    fetchrest();

}, []);

async function handlesearch(search){
   try{ let res;
    if(search==="All"){
      res = await axios.get(`/restaurants`);
    }
    else{
        res = await axios.get(`/restaurants?search=${search}`); 
    }
    setrest(res.data);}
    catch(err){
        console.log(err);
    }
}

  return (
    <>
    <div className="RestaurantListContainer">
      <Category handlesearch={handlesearch}/>
      <br/>
      <h1 style={{fontSize:"3.1rem",color:"#999999",textDecoration:"underline"}}>Restaurants</h1>
     
      <div className='restList'>
         {
            rest.map((r)=>(
                <RestaurantCard key={r._id} restaurant={r}/>
            ))
         }
      </div>
      </div>
    
    </>
  ) 
}
