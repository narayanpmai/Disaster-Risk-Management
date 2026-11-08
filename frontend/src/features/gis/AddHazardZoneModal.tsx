import React, { useState } from 'react';
import { AlertTriangle, X, MapPin, Users, Home, Shield, Phone, CheckCircle2 } from 'lucide-react';
import { disasterApi, type VulnerableSettlement } from '../../api/disaster';
import toast from 'react-hot-toast';

interface AddHazardZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddHazardZoneModal: React.FC<AddHazardZoneModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    settlementName: '',
    wardNumber: 4,
    hazardType: 'पहिरो (Landslide)',
    riskLevel: 'उच्च',
    atRiskHouseholds: 25,
    atRiskPopulation: 110,
    resettlementPriority: 'तत्काल स्थानान्तरण आवश्यक',
    safeShelterName: 'थाङपाल भ्याली मा.वि. आश्रयस्थल',
    focalPerson: '',
    focalPersonPhone: '',
    latitude: 27.9736,
    longitude: 85.6425,
  });

  if (!isOpen) return null;

  const WARD_OFFSETS: Record<number, { lat: number; lng: number }> = {
    1: { lat: 28.025, lng: 85.690 },
    2: { lat: 27.995, lng: 85.670 },
    3: { lat: 27.980, lng: 85.655 },
    4: { lat: 27.965, lng: 85.645 },
    5: { lat: 27.950, lng: 85.630 },
    6: { lat: 27.9736, lng: 85.6425 },
    7: { lat: 27.935, lng: 85.615 },
    8: { lat: 27.920, lng: 85.600 },
  };

  const handleWardChange = (ward: number) => {
    const coords = WARD_OFFSETS[ward] || WARD_OFFSETS[4];
    setFormData((prev) => ({
      ...prev,
      wardNumber: ward,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.settlementName.trim()) {
      toast.error('कृपया जोखिमयुक्त बस्ती वा क्षेत्रको नाम प्रविष्ट गर्नुहोस्');
      return;
    }

    setIsSubmitting(true);
    try {
      await disasterApi.createSettlement({
        settlementName: formData.settlementName.trim(),
        wardNumber: Number(formData.wardNumber),
        hazardType: formData.hazardType,
        riskLevel: formData.riskLevel,
        atRiskHouseholds: Number(formData.atRiskHouseholds),
        atRiskPopulation: Number(formData.atRiskPopulation),
        resettlementPriority: formData.resettlementPriority,
        safeShelterName: formData.safeShelterName.trim() || undefined,
        focalPerson: formData.focalPerson.trim() || undefined,
        focalPersonPhone: formData.focalPersonPhone.trim() || undefined,
      } as Partial<VulnerableSettlement>);

      toast.success('नयाँ पहिरो तथा जोखिमयुक्त क्षेत्र सफलतापूर्वक दर्ता भयो!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create settlement risk zone:', err);
      toast.error('जोखिम क्षेत्र दर्ता गर्दा त्रुटि आयो। कृपया पुन: प्रयास गर्नुहोस्।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                padding: '0.5rem',
                borderRadius: '10px',
                display: 'flex',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                नयाँ पहिरो तथा जोखिमयुक्त क्षेत्र पहिचान र दर्ता
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#b91c1c', margin: '0.15rem 0 0' }}>
                डिजिटल ट्विन GIS नक्सा र ३D भू-धरातलमा प्रत्यक्ष अवलोकन हुने गरी नयाँ क्षेत्र थप्नुहोस्
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Row 1: Settlement Name & Ward */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                जोखिमयुक्त बस्ती / क्षेत्रको नाम <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="उदा: मानेखर्क डाँडागाउँ, बरुवा गल्छी"
                value={formData.settlementName}
                onChange={(e) => setFormData({ ...formData, settlementName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                वडा नम्बर <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={formData.wardNumber}
                onChange={(e) => handleWardChange(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                  <option key={w} value={w}>
                    वडा नं. {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Hazard Type & Risk Level */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                विपद् / जोखिमको प्रकार
              </label>
              <select
                value={formData.hazardType}
                onChange={(e) => setFormData({ ...formData, hazardType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="पहिरो (Landslide)">पहिरो (Landslide)</option>
                <option value="बाढी तथा कटान (Flood/River Erosion)">बाढी तथा कटान (River Flood/Erosion)</option>
                <option value="गेग्रान बहाव (Debris Flow)">गेग्रान बहाव (Debris Flow)</option>
                <option value="भौगर्भिक धाँजा (Slope Fissures)">भौगर्भिक धाँजा (Slope Fissures)</option>
                <option value="हिमपहिरो (Snow/Avalanche)">हिमपहिरो (Snow/Avalanche)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                जोखिमको गाम्भीर्यता (Risk Level)
              </label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="अति उच्च">अति उच्च (Critical Risk 🔴)</option>
                <option value="उच्च">उच्च (High Risk 🟠)</option>
                <option value="मध्यम">मध्यम (Moderate Risk 🟡)</option>
                <option value="सामान्य">सामान्य (Low / Monitoring 🟢)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Households & Population at Risk */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                <Home size={14} color="#0284c7" /> जोखिममा रहेका घरधुरी संख्या
              </label>
              <input
                type="number"
                min="0"
                value={formData.atRiskHouseholds}
                onChange={(e) => setFormData({ ...formData, atRiskHouseholds: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                <Users size={14} color="#16a34a" /> प्रत्यक्ष जोखिममा पर्ने जनसंख्या
              </label>
              <input
                type="number"
                min="0"
                value={formData.atRiskPopulation}
                onChange={(e) => setFormData({ ...formData, atRiskPopulation: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 4: Resettlement Priority & Safe Evacuation Shelter */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                रोकथाम तथा न्यूनीकरण रणनीति
              </label>
              <select
                value={formData.resettlementPriority}
                onChange={(e) => setFormData({ ...formData, resettlementPriority: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="तत्काल स्थानान्तरण आवश्यक">तत्काल स्थानान्तरण आवश्यक</option>
                <option value="तटबन्धन/रोकथाम निर्माण">तटबन्धन/रोकथाम ग्याबियन निर्माण</option>
                <option value="जैविक इन्जिनियरिङ रोपण">जैविक इन्जिनियरिङ (Bio-engineering)</option>
                <option value="पूर्वतयारी तथा सतर्कता">पूर्वतयारी तथा सतर्कता अनुगमन</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                <Shield size={14} color="#10b981" /> तोकिएको सुरक्षित आश्रयस्थल
              </label>
              <input
                type="text"
                placeholder="उदा: थाङपाल भ्याली मा.वि. हल"
                value={formData.safeShelterName}
                onChange={(e) => setFormData({ ...formData, safeShelterName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 5: Focal Person Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                स्थानीय सम्पर्क व्यक्ति (Focal Person)
              </label>
              <input
                type="text"
                placeholder="उदा: दावा साङ्गे शेर्पा"
                value={formData.focalPerson}
                onChange={(e) => setFormData({ ...formData, focalPerson: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                <Phone size={14} color="#0284c7" /> आपतकालीन सम्पर्क नम्बर
              </label>
              <input
                type="text"
                placeholder="उदा: ९८५११२३४५६"
                value={formData.focalPersonPhone}
                onChange={(e) => setFormData({ ...formData, focalPersonPhone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* GPS Coordinates Display */}
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#475569',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="#ef4444" />
              <span>
                <strong>GPS स्थान:</strong> अक्षांश {formData.latitude.toFixed(4)}°, देशान्तर {formData.longitude.toFixed(4)}°
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>वडा {formData.wardNumber} को आधार बिन्दु स्वतः चयन</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'दर्ता हुँदैछ...' : 'नक्सामा सुरक्षित गर्नुहोस्'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

