import { INDIAN_CITIES } from './indianCities';
import { EMPLOYERS } from './employers';
import { useState, useRef, useEffect } from 'react';

export default function ProfileInput({ 
  netSalary, 
  onSalaryChange,
  cibil,
  onCibilChange,
  city,
  onCityChange,
  dob,
  onDobChange,
  employer,
  onEmployerChange,
  employmentVintage,
  onEmploymentVintageChange
}) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState(city || '');
  const cityDropdownRef = useRef(null);

  const [showEmployerDropdown, setShowEmployerDropdown] = useState(false);
  const [employerSearch, setEmployerSearch] = useState(employer || '');
  const employerDropdownRef = useRef(null);

  // Sync external changes (e.g. from localStorage) to local search states
  useEffect(() => {
    setCitySearch(city || '');
  }, [city]);

  useEffect(() => {
    setEmployerSearch(employer || '');
  }, [employer]);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (employerDropdownRef.current && !employerDropdownRef.current.contains(event.target)) {
        setShowEmployerDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Employer Async Search (Debounced) ---
  const [debouncedEmployerSearch, setDebouncedEmployerSearch] = useState(employerSearch);
  const [asyncEmployers, setAsyncEmployers] = useState(EMPLOYERS);
  const [isSearchingEmployer, setIsSearchingEmployer] = useState(false);

  // 1. Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmployerSearch(employerSearch);
    }, 300); // 300ms debounce delay
    return () => clearTimeout(handler);
  }, [employerSearch]);

  // 2. Mock Database Search API
  useEffect(() => {
    const fetchEmployersFromDB = async () => {
      setIsSearchingEmployer(true);
      
      // Simulate network/DB delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Mock DB query logic
      const results = EMPLOYERS.filter(e => 
        e.toLowerCase().includes(debouncedEmployerSearch.toLowerCase()) || e.includes("Other")
      );
      
      setAsyncEmployers(results);
      setIsSearchingEmployer(false);
    };

    fetchEmployersFromDB();
  }, [debouncedEmployerSearch]);

  const filteredCities = INDIAN_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="input-group" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--text)' }}>Step 1: Basic Eligibility</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.5rem' }}>
        
        {/* Salary */}
        <div>
          <div className="label-with-hint">
            <label htmlFor="net-salary">Monthly Net Salary</label>
          </div>
          <div className="input-wrapper">
            <span className="currency">₹</span>
            <input
              type="number"
              id="net-salary"
              placeholder="e.g. 50000"
              required
              min={1}
              step="any"
              value={netSalary}
              onChange={(e) => onSalaryChange(e.target.value)}
            />
          </div>
        </div>

        {/* DOB */}
        <div>
          <div className="label-with-hint">
            <label htmlFor="dob">Date of Birth</label>
          </div>
          <div className="input-wrapper">
            <input
              type="date"
              id="dob"
              required
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 56)).toISOString().split('T')[0]}
              value={dob}
              onChange={(e) => onDobChange(e.target.value)}
            />
          </div>
        </div>

        {/* Employer (Custom Dropdown) */}
        <div ref={employerDropdownRef} style={{ position: 'relative' }}>
          <div className="label-with-hint">
            <label htmlFor="employer">Employer Name</label>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              id="employer"
              placeholder="Search your company..."
              required
              value={employerSearch}
              onChange={(e) => {
                setEmployerSearch(e.target.value);
                setShowEmployerDropdown(true);
              }}
              onFocus={() => setShowEmployerDropdown(true)}
              autoComplete="off"
            />
            <span style={{ paddingRight: '1rem', pointerEvents: 'none', color: 'var(--text-main)', opacity: 0.6, fontSize: '0.8rem' }}>▼</span>
          </div>
          
          {showEmployerDropdown && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '250px', overflowY: 'auto',
              background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px',
              marginTop: '6px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              {isSearchingEmployer ? (
                <div style={{ padding: '0.8rem 1rem', color: '#64748B' }}>Searching database...</div>
              ) : asyncEmployers.length > 0 ? (
                asyncEmployers.map(e => (
                  <div key={e}
                    onClick={() => { setEmployerSearch(e); onEmployerChange(e); setShowEmployerDropdown(false); }}
                    style={{ padding: '0.8rem 1rem', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', color: '#1E293B' }}
                    onMouseOver={(ev) => ev.target.style.background = '#F8FAFC'}
                    onMouseOut={(ev) => ev.target.style.background = 'transparent'}
                  >{e}</div>
                ))
              ) : (
                <div style={{ padding: '0.8rem 1rem', color: '#64748B' }}>Type to specify company</div>
              )}
            </div>
          )}
        </div>


      </div>
      
      <div className="date-rule-explanation" style={{ marginTop: '1.5rem', background: 'var(--card-bg)', border: 'none' }}>
        <span className="rule-icon">💡</span>
        <span>Enter your accurate profile details. These are required by lenders to determine eligibility and rates.</span>
      </div>
    </div>
  );
}
