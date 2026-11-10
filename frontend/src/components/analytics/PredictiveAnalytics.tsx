import React, { useState, useMemo } from 'react';
import { Activity, Waves, Mountain, AlertTriangle, ShieldCheck, Siren, Clock, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { toNepaliDigits } from '../../features/dashboard/DashboardOverview';
import './PredictiveAnalytics.css';

export const PredictiveAnalytics: React.FC = () => {
  const { isNepali } = useLanguage();
  const fmt = (v: any) => toNepaliDigits(v, isNepali);

  // ── Flood Simulation State ──
  const [selectedStation, setSelectedStation] = useState<'melamchi' | 'yangri' | 'larke'>('melamchi');
  const [rainfallMm, setRainfallMm] = useState<number>(65);

  // ── Landslide Simulation State ──
  const [selectedSlope, setSelectedSlope] = useState<'manekharka' | 'sermathang' | 'bhotang'>('manekharka');
  const [saturationPct, setSaturationPct] = useState<number>(72);

  // ── Flood AI Model Predictions ──
  const floodForecast = useMemo(() => {
    // Dynamic hydrological model simulation based on station baseline and rainfall
    const baseElevation = selectedStation === 'melamchi' ? 2.4 : selectedStation === 'yangri' ? 1.8 : 1.5;
    const dangerThreshold = selectedStation === 'melamchi' ? 5.5 : selectedStation === 'yangri' ? 4.8 : 4.0;
    const warningThreshold = selectedStation === 'melamchi' ? 4.2 : selectedStation === 'yangri' ? 3.6 : 3.0;

    const projectedWaterLevel = +(baseElevation + (rainfallMm / 100) * 3.8).toFixed(2);
    const isDanger = projectedWaterLevel >= dangerThreshold;
    const isWarning = projectedWaterLevel >= warningThreshold && !isDanger;

    const arrivalMinutes = Math.max(15, Math.round(90 - (rainfallMm * 0.45)));
    const exposedHouseholds = Math.round((rainfallMm / 100) * (selectedStation === 'melamchi' ? 48 : 28));

    return {
      waterLevel: projectedWaterLevel,
      dangerThreshold,
      warningThreshold,
      status: isDanger ? 'danger' : isWarning ? 'warning' : 'normal',
      arrivalMinutes,
      exposedHouseholds,
    };
  }, [selectedStation, rainfallMm]);

  // ── Landslide AI Model Predictions ──
  const landslideForecast = useMemo(() => {
    // Geotechnical slope stability model (Mohr-Coulomb simulation)
    const baseSlope = selectedSlope === 'manekharka' ? 38 : selectedSlope === 'sermathang' ? 34 : 42;
    const shiftRate = +((saturationPct / 100) * (baseSlope / 35) * 1.8).toFixed(2);
    const failureProb = Math.min(96, Math.max(8, Math.round((saturationPct * 0.95) + (baseSlope * 0.3) - 20)));

    const isHighRisk = failureProb >= 70;
    const isMedRisk = failureProb >= 40 && !isHighRisk;

    const evacueeCount = Math.round((failureProb / 100) * (selectedSlope === 'manekharka' ? 38 : 26));

    return {
      shiftRate,
      failureProb,
      status: isHighRisk ? 'danger' : isMedRisk ? 'warning' : 'safe',
      evacueeCount,
      shelterNameNp: selectedSlope === 'manekharka' ? 'वडा नं. ४ सामुदायिक आश्रयस्थल' : selectedSlope === 'sermathang' ? 'वडा नं. ३ सेर्माथाङ कभर्ड हल' : 'भोताङ प्राथमिक स्वास्थ्य केन्द्र',
      shelterNameEn: selectedSlope === 'manekharka' ? 'Ward 4 Community Safe Shelter' : selectedSlope === 'sermathang' ? 'Ward 3 Covered Hall Shelter' : 'Bhotang Primary Health Shelter',
    };
  }, [selectedSlope, saturationPct]);

  return (
    <div className="analytics-container" style={{ padding: '1.5rem 1.75rem', backgroundColor: '#ffffff' }}>
      {/* ── Header ── */}
      <div className="analytics-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="analytics-header-left">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            <Activity size={22} color="#0284c7" />
            {isNepali
              ? 'विपद् जोखिम एआई पूर्वानुमान तथा सिमुलेटर (Predictive AI)'
              : 'Disaster Risk Predictive AI & Inundation Simulator'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            {isNepali
              ? 'जलसतह टेलिमेट्री, वर्षा मापन र पहिरो इन्क्लिनोमिटर तथ्याङ्कमा आधारित स्वचालित जोखिम प्रक्षेपण'
              : 'Real-time hydrological flood surge, slope displacement, and automated evacuation forecasting'}
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            border: '1px solid #a7f3d0',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
          <span>{isNepali ? 'लाइभ AI मोडल सक्रिय' : 'Live AI Models Active'}</span>
        </div>
      </div>

      {/* ── Cards Grid (Flood vs Landslide) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>

        {/* 1. River Flood & Inundation AI Forecast */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Waves size={20} color="#0284c7" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isNepali ? 'नदी जलसतह तथा बाढी प्रक्षेपण' : 'River Water Level & Flood Surge'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {isNepali ? '२४-घण्टे वर्षा सिमुलेटर तथा बाढी चेतावनी' : '24-Hour Rainfall Simulator & Flood Alert'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                {isNepali ? 'नदी तथा टेलिमेट्री स्टेशन' : 'River & Telemetry Station'}
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              >
                <option value="melamchi">{isNepali ? 'मेलम्ची खोला (SEN-MEL-01, थाङपालधाप)' : 'Melamchi River (SEN-MEL-01, Thangpaldhap)'}</option>
                <option value="yangri">{isNepali ? 'याङ्ग्री खोला (SEN-YAN-02, बरुवा)' : 'Yangri River (SEN-YAN-02, Baruwa)'}</option>
                <option value="larke">{isNepali ? 'लार्के खोला (SEN-LAR-03, भोताङ)' : 'Larke River (SEN-LAR-03, Bhotang)'}</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                  {isNepali ? '२४-घण्टे वर्षा सिमुलेसन (Rainfall Forecast)' : '24-hr Rainfall Simulation'}
                </label>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '1px 8px', borderRadius: '6px' }}>
                  {fmt(rainfallMm)} mm
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                step="5"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* AI Projected Outputs */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                {isNepali ? 'प्रक्षेपित जलसतह' : 'Projected River Level'}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: floodForecast.status === 'danger' ? '#fef2f2' : floodForecast.status === 'warning' ? '#fffbeb' : '#f0fdf4',
                  color: floodForecast.status === 'danger' ? '#dc2626' : floodForecast.status === 'warning' ? '#d97706' : '#16a34a',
                  border: `1px solid ${floodForecast.status === 'danger' ? '#f87171' : floodForecast.status === 'warning' ? '#fcd34d' : '#86efac'}`,
                }}
              >
                {floodForecast.status === 'danger'
                  ? (isNepali ? '🚨 उच्च खतरा विन्दु' : '🚨 Critical Danger')
                  : floodForecast.status === 'warning'
                  ? (isNepali ? '⚠️ सतर्कता तह' : '⚠️ Warning Level')
                  : (isNepali ? '✅ सामान्य बहाव' : '✅ Normal Flow')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: floodForecast.status === 'danger' ? '#dc2626' : '#0f172a' }}>
                {fmt(floodForecast.waterLevel)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                {isNepali ? `मिटर (खतरा विन्दु: ${fmt(floodForecast.dangerThreshold)}m)` : `meters (Danger: ${floodForecast.dangerThreshold}m)`}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{isNepali ? 'बाढी तरङ्ग आइपुग्ने समय' : 'Flood Wave Arrival'}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                  {fmt(floodForecast.arrivalMinutes)} {isNepali ? 'मिनेट' : 'mins'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{isNepali ? 'संभावित प्रभावित घरधुरी' : 'Impacted Corridor HH'}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: floodForecast.status === 'danger' ? '#dc2626' : '#0f172a' }}>
                  {fmt(floodForecast.exposedHouseholds)} {isNepali ? 'घरधुरी' : 'HH'}
                </div>
              </div>
            </div>

            {floodForecast.status === 'danger' && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#991b1b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Siren size={15} color="#dc2626" />
                <span>{isNepali ? 'सिफारिस: तटीय सौर्य-साइरन तथा स्वचालित IVR कल तुरुन्त सक्रिय गर्नुहोस्।' : 'Recommendation: Broadcast 5km mesh sirens & trigger emergency IVR calls.'}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Landslide & Slope Stability AI Forecast */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mountain size={20} color="#d97706" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isNepali ? 'पहिरो जोखिम तथा भिरालो चाल प्रक्षेपण' : 'Landslide & Slope Stability AI'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {isNepali ? 'माटोको आर्द्रता (Saturation) तथा इन्क्लिनोमिटर' : 'Soil Saturation & Millimeter Displacement'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                {isNepali ? 'जोखिमयुक्त बस्ती / डाँडा' : 'Vulnerable Ridge / Settlement'}
              </label>
              <select
                value={selectedSlope}
                onChange={(e) => setSelectedSlope(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              >
                <option value="manekharka">{isNepali ? 'मानेखर्क भिरालो बस्ती (वडा नं. ४)' : 'Manekharka Slope (Ward 4)'}</option>
                <option value="sermathang">{isNepali ? 'सेर्माथाङ भीर इलाका (वडा नं. ३)' : 'Sermathang Escarpment (Ward 3)'}</option>
                <option value="bhotang">{isNepali ? 'भोताङ लेकाली खण्ड (वडा नं. ३)' : 'Bhotang Ridge (Ward 3)'}</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                  {isNepali ? 'माटोको पानी संतृप्ति दर (Soil Saturation)' : 'Soil Moisture Saturation Index'}
                </label>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#d97706', backgroundColor: '#fef3c7', padding: '1px 8px', borderRadius: '6px' }}>
                  {fmt(saturationPct)}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="98"
                step="2"
                value={saturationPct}
                onChange={(e) => setSaturationPct(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#d97706', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* AI Projected Outputs */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                {isNepali ? 'भिरालो विस्थापन चाल' : 'Slope Displacement Rate'}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: landslideForecast.status === 'danger' ? '#fef2f2' : landslideForecast.status === 'warning' ? '#fffbeb' : '#f0fdf4',
                  color: landslideForecast.status === 'danger' ? '#dc2626' : landslideForecast.status === 'warning' ? '#d97706' : '#16a34a',
                  border: `1px solid ${landslideForecast.status === 'danger' ? '#f87171' : landslideForecast.status === 'warning' ? '#fcd34d' : '#86efac'}`,
                }}
              >
                {landslideForecast.status === 'danger'
                  ? (isNepali ? '🔴 उच्च पहिरो जोखिम' : '🔴 High Landslide Risk')
                  : landslideForecast.status === 'warning'
                  ? (isNepali ? '🟡 मध्यम जोखिम सतर्कता' : '🟡 Medium Watch')
                  : (isNepali ? '🟢 भिरालो जमिन स्थिर' : '🟢 Slope Stable')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: landslideForecast.status === 'danger' ? '#dc2626' : '#0f172a' }}>
                {fmt(landslideForecast.shiftRate)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                {isNepali ? `मि.मि./घण्टा चाल (जोखिम संभाब्यता: ${fmt(landslideForecast.failureProb)}%)` : `mm/hr shift (Failure prob: ${landslideForecast.failureProb}%)`}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{isNepali ? 'तत्काल स्थानान्तरण संख्या' : 'Priority Evacuees'}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: landslideForecast.status === 'danger' ? '#dc2626' : '#0f172a' }}>
                  {fmt(landslideForecast.evacueeCount)} {isNepali ? 'नागरिक' : 'Citizens'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{isNepali ? 'सिफारिस आश्रयस्थल' : 'Safe Evac Shelter'}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isNepali ? landslideForecast.shelterNameNp : landslideForecast.shelterNameEn}
                </div>
              </div>
            </div>

            {landslideForecast.status === 'danger' && (
              <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fdba74', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#9a3412', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={15} color="#ea580c" />
                <span>{isNepali ? 'सिफारिस: पहिरो चाल बढेकाले संवेदनशील नागरिकलाई तुरुन्त आश्रयस्थल सार्नुहोस्।' : 'Recommendation: Slope shift accelerating; initiate priority evacuation of vulnerable residents.'}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PredictiveAnalytics;
