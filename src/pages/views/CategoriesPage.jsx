import React from 'react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// GLOBAL DATA: SOLO PARENT CATEGORIES
// Exported so PublicRegisterPage can use it later
// ==========================================
export const soloParentCategories = [
  {
    code: 'a1',
    title: 'Birth of a Child as a consequence of rape',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Complaint affidavit.',
      'Medical record on the incident of rape.',
      'Sworn affidavit declaring that the solo parent has the sole parental care and support of the child or children at the time of the execution of affidavit: Provided, that for purposes of issuance of subsequent SPIC and booklet, only the sworn affidavit shall be submitted every year.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'a2',
    title: 'Widow/widower',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Marriage certificate.',
      'Death certificate of the spouse.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent, and has the sole parental care and support of the child or children: Provided, that for purposes of issuance of subsequent SPIC and booklet, only the sworn affidavit shall be submitted every year.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'a3',
    title: 'Spouse of person deprived of liberty',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Marriage certificate.',
      'Certificate of detention or a certification that the spouse is serving sentence for at least three (3) months issued by the law-enforcement agency having actual custody of the detained spouse or commitment order by the court pursuant to a conviction of the spouse.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent, and has the sole parental care and support of the child or children: Provided, That for purposes of issuance of subsequent SPIC and booklet, requirement numbers (3) and (4) under this paragraph shall be submitted every year.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'a4',
    title: 'Spouse of person with physical or mental incapacity',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Marriage certificate or affidavit of cohabitation.',
      'Medical records, medical abstract, or a certificate of confinement in the National Center for Mental Health or any medical hospital or facility as a result of the spouse\'s physical or mental incapacity, which record, medical abstract or certificate of confinement of the incapacitated spouse should have been issued not more than three (3) months before the submission, or a valid Person With Disability ID issued pursuant to Republic Act No. 10754 and Republic Act No. 7277, or the Magna Carta for Disabled Persons.',
      'Sworn affidavit that the solo parent is not cohabiting with a partner or co-parent and has sole parental care and support of the child or children: Provided, That for purposes of issuance of subsequent SPIC and booklet, requirement numbers (3) and (4) under this paragraph shall be submitted every year.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'a5',
    title: 'Due to legal separation or de facto separation',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Marriage certificate.',
      'Judicial decree of legal separation of the spouses or, in the case of de facto separation, an affidavit of two (2) disinterested persons attesting to the fact of separation of the spouses.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent, and has sole parental care and support of the child or children: Provided, That for purposes of issuance of subsequent SPIC and booklet, requirement numbers (3) and (4) under this paragraph shall be submitted every year.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'a6',
    title: 'Due to nullity or annulment of marriage',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Marriage certificate, annotated with the fact of declaration of nullity of marriage or annulment of marriage.',
      'Judicial decree of nullity or annulment of marriage or judicial recognition of foreign divorce.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent and has sole parental care and support of the child or children: Provided, that for purposes of issuance of subsequent SPIC and booklet, only the sworn affidavit shall be submitted every year.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'a7',
    title: 'Abandonment by the spouse',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Marriage certificates or affidavit of the applicant solo parent.',
      'Affidavit of two (2) disinterested persons attesting to the fact of abandonment of the spouse.',
      'Police or barangay record of the fact of abandonment.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent, and has sole parental care and support of the child or children: Provided, that for purposes of issuance of subsequent SPIC and booklet, only sworn affidavit shall be submitted every year, and.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'b1',
    title: 'Spouse of OFW',
    requirements: [
      'Birth certificate/s of dependents.',
      'Marriage certificate, if the applicant is the spouse of the OFW, or birth certificate or the other competent proof of the relationship between the applicant and the OFW, if the applicant is a family member of the OFW.',
      'Philippine Overseas Employment Administration Standard Employment Contract (POEA-SEC) or its equivalent document.',
      'Photocopy of the OFW\'s passport with stamps showing continuous twelve (12) months of overseas work, or a certification from the Bureau of Immigration.',
      'Proof of income of the OFW\'s spouse or family member.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent and has sole parental care and support of the child or children: Provided, That for purposes of issuance of subsequent SPIC and booklet, requirement numbers (3), (4), (5), and (6) under this paragraph shall be submitted every year, and.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'b2',
    title: 'Relative of OFW',
    requirements: [
      'Birth certificate/s of dependents.',
      'Marriage certificate, if the applicant is the spouse of the OFW, or birth certificate or the other competent proof of the relationship between the applicant and the OFW, if the applicant is a family member of the OFW.',
      'Philippine Overseas Employment Administration Standard Employment Contract (POEA-SEC) or its equivalent document.',
      'Photocopy of the OFW\'s passport with stamps showing continuous twelve (12) months of overseas work, or a certification from the Bureau of Immigration.',
      'Proof of income of the OFW\'s spouse or family member.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent and has sole parental care and support of the child or children: Provided, That for purposes of issuance of subsequent SPIC and booklet, requirement numbers (3), (4), (5), and (6) under this paragraph shall be submitted every year, and.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'c',
    title: 'Unmarried person',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Certificate of No Marriage (CENOMAR).',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent and has sole parental care and support of the child or children: Provided, That for the purposes of issuance of subsequent SPIC and booklet, requirement numbers (2), (3) and (4) under this paragraph shall be submitted every year, and.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'd',
    title: 'Legal guardian / Adoptive parent / Foster parent',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Proof of guardianship, such as the decision granting legal guardianship issued by a court; proof of adoption, such as the decree of adoption issued by a court, or order of Adoption issued by the DSWD or the National Authority on Child Care (NACC); proof of foster care such as the Foster Parent License issued by the DSWD or the NACC.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent and has sole parental care and support of the child or children: Provided, That for purposes of issuance of subsequent SPIC and booklet, requirement number (3) and (4) under this paragraph shall be submitted every year, and.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'e',
    title: 'Relative within the fourth (4th) civil degree of consanguinity or affinity',
    requirements: [
      'Birth certificate/s of the child or children.',
      'Death certificate, certificate of incapacity, or judicial declaration of absence or presumptive death of the parents or legal guardian; police or barangay records evidencing the fact of disappearance or absence of the parent or legal guardian for at least six (6) months.',
      'Proof of relationship of the relative to the parent or legal guardian, such as birth certificate, marriage certificate, family records, or other similar or analogous proof of relationship.',
      'Sworn affidavit declaring that the solo parent has sole parental care and support of the child or children: Provided, That for purposes of issuance of subsequent SPIC and booklet, requirement numbers (3) and (4) under this paragraph shall be submitted every year, and.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay and that the child or children is/are under the parental care and support of the solo parent, and.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  },
  {
    code: 'f',
    title: 'Pregnant woman',
    requirements: [
      'Medical record of her pregnancy.',
      'Affidavit of a barangay official attesting that the solo parent is a resident of the barangay, and.',
      'Sworn affidavit declaring that the solo parent is not cohabiting with a partner or co-parent who is providing support to the pregnant woman.',
      'Solo Parents Orientation Seminar Certificate of Attendance.'
    ]
  }
];

// ==========================================
// CATEGORIES SELECTION PAGE
// ==========================================
function CategoriesPage() {
  const navigate = useNavigate();

  const styles = {
    body: { fontFamily: 'Arial, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' },
    container: { maxWidth: '1000px', margin: '0 auto', background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderTop: '6px solid #fbbf24' },
    title: { color: '#1e3a8a', fontSize: '36px', marginBottom: '10px', textAlign: 'center', fontWeight: '900' },
    subtitle: { color: '#475569', fontSize: '16px', textAlign: 'center', marginBottom: '40px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
    categoryCard: { background: '#ffffff', padding: '25px', borderRadius: '12px', borderLeft: '6px solid #1e3a8a', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    catHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' },
    codeBadge: { background: '#fbbf24', color: '#1e3a8a', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' },
    catTitle: { margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: 'bold', lineHeight: '1.4' },
    reqBox: { background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', flex: 1 },
    reqLabel: { margin: '0 0 10px 0', fontWeight: 'bold', color: '#1e3a8a', fontSize: '14px' },
    list: { color: '#475569', fontSize: '13px', lineHeight: '1.6', paddingLeft: '20px', margin: 0 },
    btnPrimary: { background: '#1e3a8a', color: '#ffffff', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '15px', width: '100%', textAlign: 'center' },
    backBtn: { background: '#f1f5f9', color: '#475569', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'block', margin: '40px auto 0' }
  };

  return (
    <div style={styles.body} className="anim-fade-in">
      <div style={styles.container} className="anim-slide-up">
        <h2 style={styles.title}>Select Your Category</h2>
        <p style={styles.subtitle}>Review the Solo Parent categories below. Select the one that matches your situation to proceed with registration.</p>
        
        <div style={styles.grid}>
          {soloParentCategories.map((cat) => (
            <div key={cat.code} style={styles.categoryCard} className="hover-card">
              <div>
                <div style={styles.catHeader}>
                  <span style={styles.codeBadge}>{cat.code.toUpperCase()}</span>
                  <h4 style={styles.catTitle}>{cat.title}</h4>
                </div>
                <div style={styles.reqBox}>
                  <p style={styles.reqLabel}>Required Documents:</p>
                  <ul style={styles.list}>
                    {cat.requirements.map((req, idx) => (
                      <li key={idx} style={{marginBottom: '5px'}}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button 
                style={styles.btnPrimary} 
                onClick={() => navigate('/signup', { state: { selectedCategory: cat.code } })} 
                className="hover-btn"
              >
                Register as {cat.code.toUpperCase()}
              </button>
            </div>
          ))}
        </div>

        <button style={styles.backBtn} className="hover-btn" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
}

export default CategoriesPage;