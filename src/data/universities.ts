export const universities = [
  { name: "Olabisi Onabanjo University", abbreviation: "OOU" },
  { name: "University of Lagos", abbreviation: "UNILAG" },
  { name: "University of Ibadan", abbreviation: "UI" },
  { name: "Obafemi Awolowo University", abbreviation: "OAU" },
  { name: "University of Benin", abbreviation: "UNIBEN" },
  { name: "University of Nigeria, Nsukka", abbreviation: "UNN" },
  { name: "Ahmadu Bello University", abbreviation: "ABU" },
  { name: "University of Ilorin", abbreviation: "UNILORIN" },
  { name: "Lagos State University", abbreviation: "LASU" },
  { name: "Covenant University", abbreviation: "CU" },
  { name: "Babcock University", abbreviation: "BU" },
  { name: "Federal University of Technology, Akure", abbreviation: "FUTA" },
  { name: "Federal University of Technology, Minna", abbreviation: "FUTMINNA" },
  { name: "Bayero University Kano", abbreviation: "BUK" },
  { name: "University of Port Harcourt", abbreviation: "UNIPORT" },
  { name: "Nnamdi Azikiwe University", abbreviation: "UNIZIK" },
  { name: "University of Jos", abbreviation: "UNIJOS" },
  { name: "University of Abuja", abbreviation: "UNIABUJA" },
  { name: "Enugu State University of Science and Technology", abbreviation: "ESUT" },
  { name: "Delta State University", abbreviation: "DELSU" },
  { name: "Ambrose Alli University", abbreviation: "AAU" },
  { name: "Adekunle Ajasin University", abbreviation: "AAUA" },
  { name: "Osun State University", abbreviation: "UNIOSUN" },
  { name: "Rivers State University", abbreviation: "RSU" },
  { name: "Kwara State University", abbreviation: "KWASU" },
  { name: "Ladoke Akintola University of Technology", abbreviation: "LAUTECH" },
  { name: "Ekiti State University", abbreviation: "EKSU" },
  { name: "Tai Solarin University of Education", abbreviation: "TASUED" },
];

export const getAbbreviation = (univName: string) => {
  return universities.find(u => u.name === univName)?.abbreviation || "GEN";
};

export const hasUniversityPrefix = (code: string) => {
  if (!code) return false;
  const abbreviations = universities.map(u => u.abbreviation);
  return abbreviations.some(abbrev => code.toUpperCase().startsWith(`${abbrev}-`));
};
