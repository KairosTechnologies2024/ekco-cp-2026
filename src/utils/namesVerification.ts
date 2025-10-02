export const namesVerification = (email: string): string => {
  const avatarLetter = email[0]?.toUpperCase() || 'U';
  const avatarLetterTwo = email[1]?.toUpperCase() || 'U';
  let userName = 'User';
  if (avatarLetter === 'A') userName = 'Sanele';   // A for admin email, which Sanele is using
  else if (avatarLetter === 'N' && avatarLetterTwo !== 'H') userName = 'Ndabz'; // N for Ndabz email
  else if (avatarLetter === 'W') userName = 'Wasim';  // W for Wasmin email
  else if (avatarLetter === 'T') userName = 'Tasvir'; // T for Tasvir email
  else if (avatarLetter === 'B') userName = 'Blessing'; // B for Blessing email
  else if (avatarLetter === 'M') userName = 'Mikhail'; // M for Mikhail email
  else if (avatarLetter === 'L') userName = 'Leeroy'; // L for Leeroy email
  else if (avatarLetterTwo === 'H') userName = 'Nhlamulo'; // H for Nhlamulo email
  return userName;
};
