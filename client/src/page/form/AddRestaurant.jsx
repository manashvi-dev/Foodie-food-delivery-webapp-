import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import '../../css/form/Addrestaurant.css';
import { MapPin } from '../../constants/icons';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function AddRestaurant() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [form, setForm] = useState({ name: '' });
  const [searchQuery, setSearchQuery] = useState('');       // broad search input
  const [exactAddress, setExactAddress] = useState('');     // from reverse geocode after drag
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [step, setStep] = useState(1);                      // 1 = search, 2 = pinpoint
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [78.9629, 20.5937],
      zoom: 4,
    });

    map.current.addControl(new mapboxgl.NavigationControl());
  }, []);

  // ── Step 1: search broad location ──────────────────────
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

  // user picks a suggestion → fly map there, drop marker
  function handleSuggestionClick(feature) {
    const [lng, lat] = feature.center;
    setSuggestions([]);
    setSearchQuery(feature.place_name);

    // fly to location
    map.current.flyTo({ center: [lng, lat], zoom: 16 });

    // place draggable marker
    if (marker.current) {
      marker.current.setLngLat([lng, lat]);
    } else {
      marker.current = new mapboxgl.Marker({ draggable: true, color: '#f97316' })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // on drag end → reverse geocode to get exact address
      marker.current.on('dragend', () => {
        const pos = marker.current.getLngLat();
        setLocation({ lat: pos.lat, lng: pos.lng });
        reverseGeocode(pos.lng, pos.lat);
      });
    }

    setLocation({ lat, lng });
    reverseGeocode(lng, lat);

    // move to step 2
    setStep(2);
  }

  // ── Step 2: reverse geocode after drag ─────────────────
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

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat || !location.lng) {
      toast.error('Please search and pin your location first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('address', exactAddress || searchQuery);
      formData.append('lat', location.lat);
      formData.append('lng', location.lng);
      if (image) formData.append('image', image);

      await axios.post('/restaurants/new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Restaurant registered!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-rest-page">
      <div className="add-rest-header">
        <h1>Register your restaurant</h1>
        <p>Search your area, then drag the marker to your exact location</p>
      </div>

      <form onSubmit={handleSubmit} className="add-rest-form">

        {/* Restaurant name */}
        <div className="form-field">
          <label>Restaurant name</label>
          <input
            name="name" placeholder="e.g. Spice Garden"
            value={form.name} onChange={handleChange} required
          />
        </div>

        {/* Step 1 — broad search */}
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
              autoComplete="off" required
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

        {/* Step 2 — pinpoint on map */}
        <div className="form-field">
          <label>
            <span className="step-badge">Step 2</span>
            Drag the marker to your exact location
          </label>

          {/* step indicators */}
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

          {/* show pinned address after drag */}
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

        {/* Image */}
        <div className="form-field">
          <label>Restaurant image</label>
          <input type="file" accept="image/*" onChange={handleImage} required/>
        </div>

        <button
          type="submit"
          className="add-rest-btn"
          disabled={loading || !location.lat}
        >
          {loading ? 'Registering...' : 'Register restaurant'}
        </button>

      </form>
    </div>
  );
}
