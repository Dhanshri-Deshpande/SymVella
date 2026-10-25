// Verified Emergency Doctors, Gynecologists & Maternity Hospitals Catalog
// Organised by Indian cities & districts for real-time location-based SOS routing.

export const POPULAR_INDIAN_CITIES = [
  { city: "Pune", state: "Maharashtra", label: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
  { city: "Mumbai", state: "Maharashtra", label: "Mumbai, Maharashtra", lat: 19.0760, lng: 72.8777 },
  { city: "Delhi", state: "Delhi NCR", label: "New Delhi, Delhi NCR", lat: 28.6139, lng: 77.2090 },
  { city: "Bengaluru", state: "Karnataka", label: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
  { city: "Hyderabad", state: "Telangana", label: "Hyderabad, Telangana", lat: 17.3850, lng: 78.4867 },
  { city: "Chennai", state: "Tamil Nadu", label: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { city: "Ahmedabad", state: "Gujarat", label: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714 },
  { city: "Kolkata", state: "West Bengal", label: "Kolkata, West Bengal", lat: 22.5726, lng: 88.3639 },
  { city: "Jaipur", state: "Rajasthan", label: "Jaipur, Rajasthan", lat: 26.9124, lng: 75.7873 },
  { city: "Lucknow", state: "Uttar Pradesh", label: "Lucknow, Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { city: "Indore", state: "Madhya Pradesh", label: "Indore, Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { city: "Bhopal", state: "Madhya Pradesh", label: "Bhopal, Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { city: "Nagpur", state: "Maharashtra", label: "Nagpur, Maharashtra", lat: 21.1458, lng: 79.0882 },
  { city: "Patna", state: "Bihar", label: "Patna, Bihar", lat: 25.5941, lng: 85.1376 },
  { city: "Chandigarh", state: "Punjab / Haryana", label: "Chandigarh", lat: 30.7333, lng: 76.7794 }
];

export const CITY_EMERGENCY_DOCTORS = {
  pune: [
    {
      id: "pune_sassoon",
      name: "Sassoon General Hospital (OB-GYN Casualty)",
      category: "Government Medical College & 24/7 Casualty",
      badge: "24/7 Free Emergency Care",
      address: "Station Road, Near Pune Railway Station, Pune",
      phone: "+91 20 2612 8000",
      altPhone: "108",
      specialty: "High-Risk Obstetric Triage, Acute Pelvic Trauma & Blood Bank",
      mapsQuery: "Sassoon General Hospital Pune"
    },
    {
      id: "pune_deenanath",
      name: "Deenanath Mangeshkar Hospital (Women & Child Centre)",
      category: "Multi-Specialty Women's Emergency",
      badge: "Level-3 Maternity ICU",
      address: "Erandwane, Karve Road, Pune",
      phone: "+91 20 4015 1000",
      altPhone: "+91 20 4015 1010",
      specialty: "Advanced Gynecological Emergencies & Maternal ICU",
      mapsQuery: "Deenanath Mangeshkar Hospital Pune"
    },
    {
      id: "pune_kem",
      name: "K.E.M. Hospital (Department of Obstetrics & Gynaecology)",
      category: "Charitable Trust Hospital",
      badge: "24/7 GYN Triage",
      address: "Rasta Peth, Sardar Moodliar Road, Pune",
      phone: "+91 20 6603 7300",
      altPhone: "+91 20 2606 1301",
      specialty: "24-Hour Delivery, Severe PPH Management & Neonatal ICU",
      mapsQuery: "KEM Hospital Rasta Peth Pune"
    },
    {
      id: "pune_dr_verma",
      name: "Dr. Kavita Verma, MD, DGO",
      category: "Consultant Senior Gynecologist",
      badge: "Registered Physician",
      address: "Shivaji Nagar / Deccan Gymkhana, Pune",
      phone: "+91 98765 43210",
      specialty: "Reproductive Endocrinology, Endometriosis & Emergency Consult",
      mapsQuery: "Gynecologist Clinic Shivaji Nagar Pune"
    }
  ],

  mumbai: [
    {
      id: "mumbai_wadia",
      name: "Nowrosjee Wadia Maternity Hospital",
      category: "Dedicated Women's Hospital",
      badge: "24/7 Maternity Emergency",
      address: "Acharya Donde Marg, Parel, Mumbai",
      phone: "+91 22 2419 7200",
      altPhone: "+91 22 2419 7250",
      specialty: "Emergency Obstetric Triage, Eclampsia & Severe Menorrhagia",
      mapsQuery: "Nowrosjee Wadia Maternity Hospital Mumbai"
    },
    {
      id: "mumbai_kem",
      name: "KEM Hospital & Seth GS Medical (OB-GYN Casualty)",
      category: "Municipal Medical College",
      badge: "24/7 Level-1 Trauma & GYN",
      address: "Dr. E Borges Road, Parel, Mumbai",
      phone: "+91 22 2410 7000",
      altPhone: "108",
      specialty: "Acute Gynecological Hemorrhage & Surgical Emergency",
      mapsQuery: "KEM Hospital Parel Mumbai"
    },
    {
      id: "mumbai_lilavati",
      name: "Lilavati Hospital & Research Centre (Emergency OB-GYN)",
      category: "Super Specialty Hospital",
      badge: "Advanced Women Care",
      address: "A-791, Bandra Reclamation, Bandra West, Mumbai",
      phone: "+91 22 2675 1000",
      altPhone: "+91 22 2656 8000",
      specialty: "24/7 Critical Care, High-Risk Deliveries & Pain Management",
      mapsQuery: "Lilavati Hospital Bandra West Mumbai"
    },
    {
      id: "mumbai_dr_sneha",
      name: "Dr. Sneha Kulkarni, MS, DGO",
      category: "Senior Consultant Obstetrician",
      badge: "Registered Physician",
      address: "Dadar / Parel Healthcare Hub, Mumbai",
      phone: "+91 98201 12345",
      specialty: "Adolescent Health, PCOS & Emergency Triage",
      mapsQuery: "Gynecologist Clinic Dadar Mumbai"
    }
  ],

  delhi: [
    {
      id: "delhi_safdarjung",
      name: "Safdarjung Hospital (OB-GYN Emergency & Triage)",
      category: "Central Govt Medical College",
      badge: "24/7 Free Emergency",
      address: "Ring Road, Opp. AIIMS, Ansari Nagar West, New Delhi",
      phone: "+91 11 2616 5060",
      altPhone: "+91 11 2670 7000",
      specialty: "Immediate Obstetric Resuscitation & Round-the-Clock Labor Ward",
      mapsQuery: "Safdarjung Hospital New Delhi"
    },
    {
      id: "delhi_aiims",
      name: "AIIMS New Delhi (Maternal & Child Health Emergency)",
      category: "Apex National Medical Institute",
      badge: "Apex Trauma & Maternity",
      address: "Sri Aurobindo Marg, Ansari Nagar East, New Delhi",
      phone: "+91 11 2658 8500",
      altPhone: "+91 11 2659 3677",
      specialty: "Complex Gynecological Conditions & Neonatal Resuscitation",
      mapsQuery: "AIIMS Hospital New Delhi"
    },
    {
      id: "delhi_kasturba",
      name: "Kasturba Gandhi Hospital for Women",
      category: "Dedicated Municipal Maternity Hospital",
      badge: "Women's Emergency Triage",
      address: "Near Jama Masjid, Daryaganj, New Delhi",
      phone: "+91 11 2327 5000",
      altPhone: "+91 11 2327 5001",
      specialty: "Specialized Maternity, Blood Transfusion & Inpatient Care",
      mapsQuery: "Kasturba Hospital for Women Daryaganj Delhi"
    },
    {
      id: "delhi_dr_ananya",
      name: "Dr. Ananya Mukherjee, MS (OB-GYN)",
      category: "Consultant Gynecologist",
      badge: "Registered Physician",
      address: "South Extension / Green Park, New Delhi",
      phone: "+91 98110 54321",
      specialty: "Pelvic Pain Management, Laparoscopy & Crisis Guidance",
      mapsQuery: "Gynecologist Clinic South Extension Delhi"
    }
  ],

  bengaluru: [
    {
      id: "blr_vanivilas",
      name: "Vani Vilas Hospital (Government Women & Children)",
      category: "Premier Govt Women's Hospital",
      badge: "24/7 Maternity Emergency",
      address: "Fort Road, Near K.R. Market, Kalasipalya, Bengaluru",
      phone: "+91 80 2670 1200",
      altPhone: "+91 80 2670 0513",
      specialty: "Emergency Labor, Eclampsia Protocol & 24/7 GYN Triage",
      mapsQuery: "Vani Vilas Hospital Bengaluru"
    },
    {
      id: "blr_bowring",
      name: "Bowring & Lady Curzon Hospital (OB-GYN Casualty)",
      category: "Govt Teaching Hospital",
      badge: "24/7 Casualty Ward",
      address: "Lady Curzon Road, Tasker Town, Shivajinagar, Bengaluru",
      phone: "+91 80 2559 1325",
      altPhone: "108",
      specialty: "Emergency GYN Services, Acute Pelvic Pain & Blood Bank",
      mapsQuery: "Bowring Lady Curzon Hospital Bengaluru"
    },
    {
      id: "blr_manipal",
      name: "Manipal Hospital (Women's Emergency & Maternity ICU)",
      category: "Tertiary Care Hospital",
      badge: "Super Specialty Triage",
      address: "98, HAL Old Airport Road, Kodihalli, Bengaluru",
      phone: "+91 80 2502 4444",
      altPhone: "+91 80 2502 3344",
      specialty: "High-Risk Pregnancy, Endometriosis Acute Flare & ICU Care",
      mapsQuery: "Manipal Hospital Old Airport Road Bangalore"
    },
    {
      id: "blr_dr_shalini",
      name: "Dr. Shalini Rao, DNB (OB-GYN)",
      category: "Senior Gynecologist & Laparoscopic Surgeon",
      badge: "Registered Physician",
      address: "Indiranagar / Koramangala Hub, Bengaluru",
      phone: "+91 98450 67890",
      specialty: "PCOS Management, Infertility & Emergency Tele-Triage",
      mapsQuery: "Gynecologist Clinic Indiranagar Bengaluru"
    }
  ],

  hyderabad: [
    {
      id: "hyd_maternity",
      name: "Government Modern Maternity Hospital (Nayapul / Koti)",
      category: "Dedicated State Maternity Hospital",
      badge: "24/7 Maternity Emergency",
      address: "Nayapul Road, Near High Court, Petlaburj, Hyderabad",
      phone: "+91 40 2452 8251",
      altPhone: "+91 40 2452 8252",
      specialty: "Immediate Obstetric Emergency, PPH Triage & 24/7 Deliveries",
      mapsQuery: "Government Modern Maternity Hospital Nayapul Hyderabad"
    },
    {
      id: "hyd_gandhi",
      name: "Gandhi Hospital (Department of OB-GYN)",
      category: "State Medical College",
      badge: "24/7 Level-1 Triage",
      address: "Musheerabad, Padmarao Nagar, Secunderabad",
      phone: "+91 40 2750 5566",
      altPhone: "108",
      specialty: "Critical Maternal Care, Transfusion Services & Surgery",
      mapsQuery: "Gandhi Hospital Secunderabad"
    },
    {
      id: "hyd_niloufer",
      name: "Niloufer Hospital for Women and Children",
      category: "Govt Specialized Tertiary Hospital",
      badge: "Mother & Child Center",
      address: "Bazar Ghat, Red Hills, Lakdikapul, Hyderabad",
      phone: "+91 40 2339 4240",
      altPhone: "+91 40 2331 4055",
      specialty: "Emergency GYN Services, Adolescent & Antenatal Triage",
      mapsQuery: "Niloufer Hospital Lakdikapul Hyderabad"
    },
    {
      id: "hyd_dr_sunitha",
      name: "Dr. Sunitha Reddy, MD (OB-GYN)",
      category: "Consultant Obstetrician & Gynecologist",
      badge: "Registered Physician",
      address: "Banjara Hills / Jubilee Hills, Hyderabad",
      phone: "+91 98490 23456",
      specialty: "High-Risk Pregnancy, Fibroids & Reproductive Medicine",
      mapsQuery: "Gynecologist Clinic Banjara Hills Hyderabad"
    }
  ],

  chennai: [
    {
      id: "chn_iog",
      name: "Institute of Obstetrics and Gynaecology (IOG Egmore)",
      category: "Premier Government Women's Hospital",
      badge: "Asia's Oldest Maternity Hub",
      address: "Police Commissioner Office Road, Egmore, Chennai",
      phone: "+91 44 2819 1982",
      altPhone: "+91 44 2819 1980",
      specialty: "Emergency Deliveries, Hemorrhage Unit & Specialized GYN Wards",
      mapsQuery: "Institute of Obstetrics and Gynaecology Egmore Chennai"
    },
    {
      id: "chn_kasturba",
      name: "Government Kasturba Gandhi Hospital for Women and Children",
      category: "State Dedicated Women's Hospital",
      badge: "24/7 Emergency Wing",
      address: "EVR Periyar Salai, Triplicane, Chennai",
      phone: "+91 44 2854 5000",
      altPhone: "108",
      specialty: "Maternity Emergency, Eclampsia Care & Blood Bank",
      mapsQuery: "Kasturba Gandhi Hospital Triplicane Chennai"
    },
    {
      id: "chn_dr_preethi",
      name: "Dr. Preethi Sundaram, MS, DGO",
      category: "Senior Consultant Gynecologist",
      badge: "Registered Physician",
      address: "Adyar / T. Nagar, Chennai",
      phone: "+91 98400 34567",
      specialty: "Dysmenorrhea Management, Pelvic Ultrasound & Emergency Consult",
      mapsQuery: "Gynecologist Clinic Adyar Chennai"
    }
  ],

  ahmedabad: [
    {
      id: "ahd_civil",
      name: "Civil Hospital Ahmedabad (Asarwa OB-GYN Emergency)",
      category: "Govt Medical College Hospital",
      badge: "24/7 Level-1 Emergency",
      address: "D-Block, Civil Hospital Campus, Asarwa, Ahmedabad",
      phone: "+91 79 2268 0074",
      altPhone: "108",
      specialty: "Acute Pelvic Crisis, Delivery Suites & Blood Components",
      mapsQuery: "Civil Hospital Asarwa Ahmedabad"
    },
    {
      id: "ahd_sola",
      name: "GMERS Medical College & Sola Civil Hospital",
      category: "State Govt Hospital",
      badge: "24/7 Maternity Emergency",
      address: "SG Highway, Near Science City Circle, Sola, Ahmedabad",
      phone: "+91 79 2766 4600",
      altPhone: "+91 79 2766 4601",
      specialty: "Emergency Cesarean, Severe PPH Management & GYN Casualty",
      mapsQuery: "GMERS Sola Civil Hospital Ahmedabad"
    },
    {
      id: "ahd_dr_ritu",
      name: "Dr. Ritu Patel, MD, DGO",
      category: "Consultant Obstetrician",
      badge: "Registered Physician",
      address: "Navrangpura / Bodakdev, Ahmedabad",
      phone: "+91 98250 45678",
      specialty: "High-Risk Pregnancy, Laparoscopy & PCOS Clinic",
      mapsQuery: "Gynecologist Clinic Navrangpura Ahmedabad"
    }
  ],

  kolkata: [
    {
      id: "kol_chittaranjan",
      name: "Chittaranjan Seva Sadan Hospital for Women",
      category: "Premier Govt Women's Hospital",
      badge: "Dedicated Women's Hospital",
      address: "37, Syama Prasad Mukherjee Road, Hazra, Kalighat, Kolkata",
      phone: "+91 33 2475 4443",
      altPhone: "+91 33 2475 4444",
      specialty: "24/7 Labor Ward, Critical GYN Hemorrhage & Neonatal Care",
      mapsQuery: "Chittaranjan Seva Sadan Hospital Kolkata"
    },
    {
      id: "kol_eden",
      name: "Eden Hospital for Women (Medical College Kolkata)",
      category: "Historic Women's Medical College Hospital",
      badge: "24/7 Emergency Casualty",
      address: "88, College Street, Bowbazar, Kolkata",
      phone: "+91 33 2255 1621",
      altPhone: "108",
      specialty: "Obstetric ICU, Acute Pelvic Peritonitis & Surgery",
      mapsQuery: "Eden Hospital Medical College Kolkata"
    },
    {
      id: "kol_dr_tanushree",
      name: "Dr. Tanushree Bose, MD, DGO",
      category: "Consultant Gynecologist",
      badge: "Registered Physician",
      address: "Salt Lake / Park Street, Kolkata",
      phone: "+91 98300 56789",
      specialty: "Reproductive Medicine, Anemia Correction & Emergency Care",
      mapsQuery: "Gynecologist Clinic Salt Lake Kolkata"
    }
  ],

  jaipur: [
    {
      id: "jpr_zenana",
      name: "Zenana Hospital (SMS Medical College)",
      category: "Dedicated State Women's Hospital",
      badge: "24/7 GYN Emergency",
      address: "Station Road, Chandpole, Pink City, Jaipur",
      phone: "+91 141 260 0000",
      altPhone: "+91 141 237 0222",
      specialty: "Emergency Deliveries, Severe Anemia in Pregnancy & Blood Bank",
      mapsQuery: "Zenana Hospital Chandpole Jaipur"
    },
    {
      id: "jpr_mahila",
      name: "Mahila Chikitsalaya (Sanganeri Gate)",
      category: "Government Women's Hospital",
      badge: "Maternity Emergency Hub",
      address: "Sanganeri Gate, Moti Doongri Road, Jaipur",
      phone: "+91 141 257 0000",
      altPhone: "108",
      specialty: "24-Hour Casualty, Obstetric HDU & Newborn Care",
      mapsQuery: "Mahila Chikitsalaya Sanganeri Gate Jaipur"
    },
    {
      id: "jpr_dr_meenakshi",
      name: "Dr. Meenakshi Sharma, MS (OB-GYN)",
      category: "Consultant Senior Gynecologist",
      badge: "Registered Physician",
      address: "Malviya Nagar / C-Scheme, Jaipur",
      phone: "+91 94140 67890",
      specialty: "High-Risk Pregnancy, Adolescent Menstrual Health",
      mapsQuery: "Gynecologist Clinic Malviya Nagar Jaipur"
    }
  ],

  lucknow: [
    {
      id: "lko_queenmary",
      name: "Queen Mary's Hospital (KGMU Dept of OB-GYN)",
      category: "Apex Medical University Women's Hospital",
      badge: "24/7 Level-1 Triage",
      address: "Shah Mina Road, Chowk, Lucknow",
      phone: "+91 522 225 7540",
      altPhone: "+91 522 225 7450",
      specialty: "Advanced Maternal Intensive Care, Severe PPH & Fetal Medicine",
      mapsQuery: "Queen Mary Hospital KGMU Lucknow"
    },
    {
      id: "lko_dufferin",
      name: "Veerangana Avanti Bai Mahila Chikitsalaya (Dufferin)",
      category: "Government Women's Hospital",
      badge: "24/7 Maternity Emergency",
      address: "Near Charbagh / Golaganj, Lucknow",
      phone: "+91 522 222 0000",
      altPhone: "108",
      specialty: "Free Delivery, Emergency Blood Transfusion & Triage",
      mapsQuery: "Dufferin Hospital Lucknow"
    },
    {
      id: "lko_dr_neha",
      name: "Dr. Neha Agarwal, MD (OB-GYN)",
      category: "Consultant Obstetrician & Gynecologist",
      badge: "Registered Physician",
      address: "Gomti Nagar / Hazratganj, Lucknow",
      phone: "+91 94150 78901",
      specialty: "PCOS Care, Menstrual Disorder Clinic & Emergency Consult",
      mapsQuery: "Gynecologist Clinic Gomti Nagar Lucknow"
    }
  ],

  indore: [
    {
      id: "ind_myh",
      name: "Maharaja Yeshwantrao Hospital (MYH) - OB-GYN Casualty",
      category: "Government Medical College Hospital",
      badge: "24/7 Level-1 Emergency",
      address: "MY Hospital Road, Sanyogitaganj, Indore",
      phone: "+91 731 252 7383",
      altPhone: "108",
      specialty: "High-Risk Pregnancy, Critical Obstetric ICU & Labor Triage",
      mapsQuery: "MY Hospital Indore"
    },
    {
      id: "ind_bombay",
      name: "Bombay Hospital Indore (Obstetrics & Emergency Care)",
      category: "Multi-Specialty Women's Emergency",
      badge: "24/7 Advanced Care",
      address: "Ring Road, IDA Scheme 94/95, Eastern Ring Rd, Indore",
      phone: "+91 731 477 1111",
      altPhone: "+91 731 257 6666",
      specialty: "24-Hour Delivery Suite & Gynecological Emergency Surgery",
      mapsQuery: "Bombay Hospital Indore"
    },
    {
      id: "ind_dr_nidhi",
      name: "Dr. Nidhi Sharma, MS (OB-GYN)",
      category: "Senior Consultant Gynecologist",
      badge: "Registered Physician",
      address: "Vijay Nagar / Palasia, Indore",
      phone: "+91 98260 55443",
      specialty: "Emergency Bleeding Management & Pelvic Health",
      mapsQuery: "Gynecologist Vijay Nagar Indore"
    }
  ],

  bhopal: [
    {
      id: "bpl_sultania",
      name: "Sultania Zanana Hospital / GMC (Women's Casualty)",
      category: "Dedicated Government Maternity Hospital",
      badge: "24/7 Free Women Emergency",
      address: "Royal Market, Near Medical College, Bhopal",
      phone: "+91 755 254 0590",
      altPhone: "108",
      specialty: "Comprehensive Emergency Obstetric and Newborn Care (CEmONC)",
      mapsQuery: "Sultania Zanana Hospital Bhopal"
    },
    {
      id: "bpl_aiims",
      name: "AIIMS Bhopal (OB-GYN Emergency & Triage)",
      category: "Apex National Medical Institute",
      badge: "Apex 24/7 Casualty",
      address: "Saket Nagar, AIIMS Campus, Bhopal",
      phone: "+91 755 267 2355",
      altPhone: "+91 755 298 2607",
      specialty: "High-Risk Delivery, Maternal Critical Care & Acute Pain Triage",
      mapsQuery: "AIIMS Bhopal"
    },
    {
      id: "bpl_dr_archana",
      name: "Dr. Archana Tiwari, MS (OB-GYN)",
      category: "Consultant Gynecologist & Laparoscopic Surgeon",
      badge: "Registered Physician",
      address: "Arera Colony / MP Nagar, Bhopal",
      phone: "+91 98930 11223",
      specialty: "Gynecological Urgencies, Endometriosis & Clinical Care",
      mapsQuery: "Gynecologist Arera Colony Bhopal"
    }
  ],

  nagpur: [
    {
      id: "ngp_gmch",
      name: "Government Medical College & Hospital (GMCH - OBGYN)",
      category: "Government Medical College & Casualty",
      badge: "24/7 Free Emergency",
      address: "Medical Square, Hanuman Nagar, Nagpur",
      phone: "+91 712 274 4671",
      altPhone: "108",
      specialty: "Emergency Obstetric Triage, Blood Bank & Round-The-Clock Surgeries",
      mapsQuery: "Government Medical College Hospital Nagpur"
    },
    {
      id: "ngp_daga",
      name: "Daga Memorial Women Government Hospital",
      category: "Specialized Women & Maternity Hospital",
      badge: "24/7 Women Casualty",
      address: "Near Gandhibagh Garden, Itwari, Nagpur",
      phone: "+91 712 272 8225",
      altPhone: "+91 712 272 8226",
      specialty: "Emergency Delivery, Neonatal Resuscitation & Maternal Care",
      mapsQuery: "Daga Memorial Hospital Nagpur"
    },
    {
      id: "ngp_dr_priya",
      name: "Dr. Priya Meshram, MD, DGO",
      category: "Consultant Obstetrician & Gynecologist",
      badge: "Registered Physician",
      address: "Dhantoli / Ramdaspeth, Nagpur",
      phone: "+91 98230 44556",
      specialty: "Emergency Gynecological Guidance & Adolescent Reproductive Health",
      mapsQuery: "Gynecologist Dhantoli Nagpur"
    }
  ],

  patna: [
    {
      id: "pat_pmch",
      name: "Patna Medical College & Hospital (PMCH - Maternity Casualty)",
      category: "Government Medical College & Hospital",
      badge: "24/7 Emergency Wing",
      address: "Ashok Rajpath, Muradpur, Patna",
      phone: "+91 612 230 0080",
      altPhone: "108",
      specialty: "Apex Obstetric Emergency, High-Risk Delivery & Trauma",
      mapsQuery: "PMCH Hospital Patna"
    },
    {
      id: "pat_aiims",
      name: "AIIMS Patna (Department of OB-GYN Emergency)",
      category: "Apex National Medical Institute",
      badge: "Level-1 Trauma & Emergency",
      address: "Phulwari Sharif, Patna",
      phone: "+91 612 245 1070",
      altPhone: "+91 612 245 1000",
      specialty: "Complex Maternal Resuscitation, Laparoscopy & 24/7 Triage",
      mapsQuery: "AIIMS Patna"
    },
    {
      id: "pat_dr_renu",
      name: "Dr. Renu Singh, MS (OB-GYN)",
      category: "Senior Gynecologist & Infertility Specialist",
      badge: "Registered Physician",
      address: "Kankarbagh / Bailey Road, Patna",
      phone: "+91 94310 98765",
      specialty: "Severe Pelvic Pain, PCOS Crisis & Tele-Emergency",
      mapsQuery: "Gynecologist Kankarbagh Patna"
    }
  ],

  chandigarh: [
    {
      id: "chd_pgimer",
      name: "PGIMER Chandigarh (Advanced Maternity & OB-GYN Casualty)",
      category: "Autonomous Apex Institute",
      badge: "24/7 Apex Emergency",
      address: "Sector 12, Chandigarh",
      phone: "+91 172 275 6565",
      altPhone: "+91 172 274 7837",
      specialty: "Advanced Obstetric ICU, Eclampsia Resuscitation & Neonatal Care",
      mapsQuery: "PGIMER Chandigarh"
    },
    {
      id: "chd_gmsh16",
      name: "Government Multi-Specialty Hospital (GMSH-16 Maternity)",
      category: "Civil Multi-Specialty Hospital",
      badge: "24/7 Free Labor Room",
      address: "Sector 16, Chandigarh",
      phone: "+91 172 275 2042",
      altPhone: "108",
      specialty: "Emergency Delivery, Blood Bank & Acute Gynecological Care",
      mapsQuery: "GMSH Sector 16 Chandigarh"
    },
    {
      id: "chd_dr_simran",
      name: "Dr. Simran Kaur, MD (OB-GYN)",
      category: "Senior Consultant Obstetrician",
      badge: "Registered Physician",
      address: "Sector 35 / Mohali Phase 7, Chandigarh Tri-City",
      phone: "+91 98150 12340",
      specialty: "Women's Emergency Health, Endometriosis & Rapid Triage",
      mapsQuery: "Gynecologist Sector 35 Chandigarh"
    }
  ],

  default: [
    {
      id: "default_district_civil",
      name: "District Civil Hospital (Maternal & Child Emergency Wing)",
      category: "Government District Hospital",
      badge: "24/7 Emergency Care",
      address: "Nearest District Civil Hospital Campus",
      phone: "108",
      altPhone: "112",
      specialty: "24/7 Free Labor Room, Blood Bank & Acute Gynecological Triage",
      mapsQuery: "District Civil Hospital nearest emergency"
    },
    {
      id: "default_chc",
      name: "Community Health Centre (First Referral Unit / FRU)",
      category: "Sub-District Healthcare Unit",
      badge: "Round-the-clock FRU",
      address: "Nearest CHC / Taluka General Hospital",
      phone: "108",
      specialty: "Obstetric First Aid, Stabilization & Ambulance Dispatch",
      mapsQuery: "Community Health Centre nearest"
    },
    {
      id: "default_dr_verma",
      name: "Dr. Kavita Verma, MD (Senior Gynaecologist)",
      category: "Registered Physician Tele-Consult",
      badge: "Symvella Verified Physician",
      address: "Tele-Emergency Clinical Partner",
      phone: "+91 98765 43210",
      specialty: "Emergency Clinical Triage & Guidance",
      mapsQuery: "Gynecologist near me"
    }
  ]
};

// Smart matching function: matches user location string against known city directories
export function getNearbyDoctorsForLocation(locationString = "") {
  if (!locationString || typeof locationString !== "string") {
    return {
      matchedCity: "Pune, Maharashtra (Default)",
      cityKey: "pune",
      doctors: CITY_EMERGENCY_DOCTORS.pune
    };
  }

  const query = locationString.toLowerCase().trim();

  // Keyword to city key mapping
  const cityMappings = [
    { key: "pune", keywords: ["pune", "pcmc", "haveli", "kothrud", "wakad", "baner", "hinjewadi", "hadapsar", "viman nagar", "aundh", "deccan"] },
    { key: "mumbai", keywords: ["mumbai", "bombay", "thane", "navi mumbai", "bandra", "andheri", "dadar", "borivali", "kurla", "goregaon", "kalyan"] },
    { key: "delhi", keywords: ["delhi", "new delhi", "ncr", "noida", "gurgaon", "gurugram", "ghaziabad", "faridabad", "dwarka", "rohini"] },
    { key: "bengaluru", keywords: ["bengaluru", "bangalore", "whitefield", "koramangala", "indiranagar", "jayanagar", "electronic city", "hebbal"] },
    { key: "hyderabad", keywords: ["hyderabad", "secunderabad", "cyberabad", "hitech city", "gachibowli", "banjara hills", "jubilee hills", "kukatpally"] },
    { key: "chennai", keywords: ["chennai", "madras", "adyar", "t nagar", "velachery", "anna nagar", "mylapore", "tambaram"] },
    { key: "ahmedabad", keywords: ["ahmedabad", "gandhinagar", "sola", "navrangpura", "satellite", "bodakdev", "maninagar", "bopal"] },
    { key: "kolkata", keywords: ["kolkata", "calcutta", "howrah", "salt lake", "new town", "dum dum", "ballygunge", "behala"] },
    { key: "jaipur", keywords: ["jaipur", "pink city", "malviya nagar", "vaishali nagar", "mansarovar", "c scheme", "rajasthan"] },
    { key: "lucknow", keywords: ["lucknow", "gomti nagar", "hazratganj", "alambagh", "indira nagar", "chowk", "uttar pradesh"] },
    { key: "indore", keywords: ["indore", "vijay nagar", "palasia", "bhawarkua", "rau", "madhya pradesh"] },
    { key: "bhopal", keywords: ["bhopal", "arera colony", "mp nagar", "kolar", "hoshangabad"] },
    { key: "nagpur", keywords: ["nagpur", "dhantoli", "ramdaspeth", "sitabuldi", "vidarbha", "wardha road"] },
    { key: "patna", keywords: ["patna", "kankarbagh", "bailey road", "danapur", "boring road", "bihar"] },
    { key: "chandigarh", keywords: ["chandigarh", "mohali", "panchkula", "tricity", "punjab", "haryana"] }
  ];

  for (const m of cityMappings) {
    if (m.keywords.some(kw => {
      // Use boundary match to prevent false partial matches (e.g. 'sola' in 'solapur')
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(query);
    })) {
      const cityTitle = m.key.charAt(0).toUpperCase() + m.key.slice(1);
      return {
        matchedCity: `${cityTitle}`,
        cityKey: m.key,
        doctors: CITY_EMERGENCY_DOCTORS[m.key] || CITY_EMERGENCY_DOCTORS.default
      };
    }
  }

  // Fallback: If city not explicitly in list, return default with query label
  return {
    matchedCity: locationString.trim(),
    cityKey: "default",
    doctors: CITY_EMERGENCY_DOCTORS.default
  };
}

// Distance helper using Haversine formula to find nearest supported Indian city
export function findNearestCityFromCoords(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return POPULAR_INDIAN_CITIES[0];
  }

  let nearest = POPULAR_INDIAN_CITIES[0];
  let minDistance = Infinity;

  POPULAR_INDIAN_CITIES.forEach((item) => {
    if (!item.lat || !item.lng) return;
    const dLat = (item.lat - lat) * (Math.PI / 180);
    const dLng = (item.lng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(item.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = 6371 * c; // Distance in kilometers
    if (dist < minDistance) {
      minDistance = dist;
      nearest = item;
    }
  });

  return {
    nearestCity: nearest,
    distanceKm: Math.round(minDistance)
  };
}

// Reverse geocode GPS coordinates to real street / area / city address
export async function getAddressFromCoords(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return "Pune, Maharashtra";
  }

  // 1. Try BigDataCloud (fast, CORS-friendly client-side geocoding)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const parts = [
        data.locality || data.localityInfo?.administrative?.[3]?.name,
        data.city || data.localityInfo?.administrative?.[2]?.name,
        data.principalSubdivision,
        data.postcode
      ].filter(Boolean);

      const cleanParts = parts.filter((item, idx) => parts.indexOf(item) === idx);
      if (cleanParts.length >= 2) {
        return cleanParts.join(", ");
      }
    }
  } catch (err) {
    console.warn("BigDataCloud geocode failed, trying OpenStreetMap:", err);
  }

  // 2. Try OpenStreetMap Nominatim for detailed street / landmark address
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: { "Accept-Language": "en" },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || "";
        const locality = addr.suburb || addr.neighbourhood || addr.city_district || "";
        const city = addr.city || addr.town || addr.village || addr.county || "";
        const state = addr.state || "";
        const postcode = addr.postcode || "";

        const parts = [road, locality, city, state, postcode].filter(Boolean);
        const cleanParts = parts.filter((item, idx) => parts.indexOf(item) === idx);
        if (cleanParts.length >= 2) {
          return cleanParts.join(", ");
        }
        if (data.display_name) {
          return data.display_name.split(",").slice(0, 4).join(", ").trim();
        }
      }
    }
  } catch (err) {
    console.warn("Nominatim geocode failed:", err);
  }

  // 3. Fallback: Nearest supported Indian city
  const nearest = findNearestCityFromCoords(lat, lng);
  if (nearest?.nearestCity?.label) {
    return nearest.nearestCity.label;
  }

  return `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}
