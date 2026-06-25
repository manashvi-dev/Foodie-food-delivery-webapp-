import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import '../../css/form/Addrestaurant.css';
import { MapPin } from '../../constants/icons';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [form, setForm] = useState({ name: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [exactAddress, setExactAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loc, setloc] = useState({ lat: null, lng: null });
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);  // ✅ false not true

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.get(`/restaurants/${id}`);
        const rest = res.data.rest;

        setForm({ name: rest.name });
        setSearchQuery(rest.address);
        setExactAddress(rest.address);
        setImage(rest.image?.url || null);

        const lat = rest.location?.lat;
        const lng = rest.location?.lng;

        if (lat && lng) {
          setloc({ lat, lng });  // ✅ setloc not setLocation
          setStep(2);
        }

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: lat && lng ? [lng, lat] : [78.9629, 20.5937],
          zoom: lat && lng ? 15 : 4,
        });

        map.current.addControl(new mapboxgl.NavigationControl());

        if (lat && lng) {
          map.current.on('load', () => {
            marker.current = new mapboxgl.Marker({ draggable: true, color: '#f97316' })
              .setLngLat([lng, lat])
              .addTo(map.current);

            marker.current.on('dragend', () => {
              const pos = marker.current.getLngLat();
              setloc({ lat: pos.lat, lng: pos.lng });  // ✅ setloc
              reverseGeocode(pos.lng, pos.lat);
            });
          });
        }
      } catch (err) {
        toast.error('Failed to load restaurant');
      }
    }

    init();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  async function handleSearchChange(e) {
    const value = e.target.value;
    setSearchQuery(value);
    setSuggestions([]);
    if (value.length < 3) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json` +
        `?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&autocomplete=true&limit=5&country=IN`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.log(err);
    }
  }

  function handleSuggestionClick(feature) {
    const [lng, lat] = feature.center;
    setSuggestions([]);
    setSearchQuery(feature.place_name);
    map.current.flyTo({ center: [lng, lat], zoom: 16 });

    if (marker.current) {
      marker.current.setLngLat([lng, lat]);
    } else {
      marker.current = new mapboxgl.Marker({ draggable: true, color: '#f97316' })
        .setLngLat([lng, lat])
        .addTo(map.current);

      marker.current.on('dragend', () => {
        const pos = marker.current.getLngLat();
        setloc({ lat: pos.lat, lng: pos.lng });
        reverseGeocode(pos.lng, pos.lat);
      });
    }

    setloc({ lat, lng });
    reverseGeocode(lng, lat);
    setStep(2);
  }

  async function reverseGeocode(lng, lat) {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
        `?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );
      const data = await res.json();
      const place = data.features?.[0]?.place_name;
      if (place) setExactAddress(place);
    } catch (err) {
      console.log(err);
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loc.lat || !loc.lng) {
      toast.error('Please search and pin your location first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('address', exactAddress || searchQuery);
      formData.append('lat', loc.lat);
      formData.append('lng', loc.lng);
      // ✅ only append new file, not existing URL string
      if (image && typeof image !== 'string') formData.append('image', image);

      await axios.patch(`/restaurants/edit/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Restaurant updated!');
      navigate(`/restaurants/${id}`);  // ✅ back to restaurant page
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-rest-page">
      <div className="add-rest-header">
        <h1>Edit restaurant</h1>  {/* ✅ */}
        <p>Update your restaurant details and location</p>
      </div>

      <form onSubmit={handleSubmit} className="add-rest-form">

        <div className="form-field">
          <label>Restaurant name</label>
          <input
            name="name" placeholder="e.g. Spice Garden"
            value={form.name} onChange={handleChange} required
          />
        </div>

        <div className="form-field">
          <label>
            <span className="step-badge">Step 1</span>
            Search your area
          </label>
          <div className="autocomplete-wrap">
            <input
              placeholder="e.g. Koramangala, Bangalore"
              value={searchQuery}
              onChange={handleSearchChange}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((s) => (
                  <li key={s.id} onClick={() => handleSuggestionClick(s)}>
                    <span className="suggestion-icon"><MapPin size={15} /></span>
                    <div>
                      <p className="suggestion-main">{s.text}</p>
                      <p className="suggestion-sub">{s.place_name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-field">
          <label>
            <span className="step-badge">Step 2</span>
            Drag the marker to your exact location
          </label>
          <div className="step-indicators">
            <div className={`step-indicator ${step >= 1 ? 'done' : ''}`}>
              <span>1</span> Search area
            </div>
            <div className="step-line" />
            <div className={`step-indicator ${step >= 2 ? 'done' : ''}`}>
              <span>2</span> Drag to exact spot
            </div>
          </div>

          <div ref={mapContainer} className="add-rest-map" />

          {exactAddress && (
            <div className="pinned-address">
              <span><MapPin size={15} /></span>
              <div>
                <p className="pinned-label">Pinned address</p>
                <p className="pinned-value">{exactAddress}</p>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Image with preview */}
        <div className="form-field">
          <label>Restaurant image</label>
          {image && (
            <img
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt="preview"
              style={{
                width: '100%', height: '180px', objectFit: 'cover',
                borderRadius: '8px', marginBottom: '8px', display: 'block'
              }}
            />
          )}
          <input type="file" accept="image/*" onChange={handleImage} />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Leave empty to keep current image
          </p>
        </div>

        <button
          type="submit"
          className="add-rest-btn"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update restaurant'}  {/* ✅ */}
        </button>

      </form>
    </div>
  );
}
