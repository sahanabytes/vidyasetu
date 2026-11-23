import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Brain,
  History,
  GraduationCap,
  Users,
  ArrowRight,
  Sparkles,
  Languages,
  Award,
  Flame,
  LogOut
} from 'lucide-react';
import ProfilePersonalise from './components/ProfilePersonalise';
import WelcomeAuthPage from './components/WelcomeAuthPage';
import VidyaSetuDashboard from './components/VidyaSetuDashboard';

const CLASS8_CHAPTERS = [
  {
    id: 'ch1',
    titleKn: 'ಅಧ್ಯಾಯ 01: ವರ್ಗ ಮತ್ತು ಘನ (A Square and A Cube)',
    titleEn: 'Chapter 01: A Square and A Cube',
    conceptKn:
      'ವರ್ಗ ಸಂಖ್ಯೆಗಳು, ಘನ ಸಂಖ್ಯೆಗಳು, ಅವಿಭಾಜ್ಯ ಅಪವರ್ತನ ವಿಧಾನದಿಂದ ವರ್ಗಮೂಲ ಮತ್ತು ಘನಮೂಲ ಕಂಡುಹಿಡಿಯುವುದು ಹಾಗೂ ದೈನಂದಿನ ಅನ್ವಯಗಳು.',
    conceptEn:
      'Square and cube number patterns, finding squares, square roots, cubes, and cube roots by prime factorisation, and everyday applications.',
    hintKn:
      'ಹಂತ 1: ಸಂಖ್ಯೆಯನ್ನು ಅವಿಭಾಜ್ಯ ಅಪವರ್ತನಗಳಾಗಿ ವಿಭಜಿಸಿ. ಹಂತ 2: ವರ್ಗಮೂಲಕ್ಕೆ 2ರ ಗುಂಪು ಮತ್ತು ಘನಮೂಲಕ್ಕೆ 3ರ ಗುಂಪು ಮಾಡಿ.',
    hintEn:
      'Step 1: Factorise into prime factors. Step 2: Group pairs of 2 for square roots and triplets of 3 for cube roots.',
    quizQ: 'What is the cube of 4? (4ರ ಘನ ಬೆಲೆ ಎಷ್ಟು?)',
    wrongOpt: '12',
    correctOpt: '64',
    explanationKn: '4 × 4 × 4 = 64. (4ರ ಮೂರು ಪಟ್ಟು ಗುಣಾಕಾರ 64 ಆಗುತ್ತದೆ).',
    explanationEn: '4 × 4 × 4 = 64.'
  },
  {
    id: 'ch2',
    titleKn: 'ಅಧ್ಯಾಯ 02: ಘಾತಾಂಕಗಳು ಮತ್ತು ಶಕ್ತಿ (Power Play)',
    titleEn: 'Chapter 02: Power Play',
    conceptKn:
      'ಘಾತಾಂಕಗಳು, ಘಾತಾಂಕಗಳ ನಿಯಮಗಳು (a^m × a^n = a^(m+n), a^m / a^n = a^(m-n)), ಮತ್ತು ವೈಜ್ಞಾನಿಕ ಸಂಕೇತ.',
    conceptEn:
      'Exponents, laws of exponents, scientific notation, and word problems involving powers.',
    hintKn:
      'ಆಧಾರ (base) ಒಂದೇ ಆಗಿದ್ದಾಗ ಗುಣಾಕಾರದಲ್ಲಿ ಘಾತಗಳನ್ನು ಕೂಡಿಸಿ (m + n).',
    hintEn:
      'When multiplying powers with the same base, add the exponents: a^m × a^n = a^(m+n).',
    quizQ: 'Simplify: 2³ × 2² (2³ × 2² ಸರಳೀಕರಿಸಿ)',
    wrongOpt: '2⁶',
    correctOpt: '2⁵',
    explanationKn: '2³ × 2² = 2^(3+2) = 2⁵ = 32.',
    explanationEn: '2³ × 2² = 2^(3+2) = 2⁵.'
  },
  {
    id: 'ch3',
    titleKn: 'ಅಧ್ಯಾಯ 03: ಸಂಖ್ಯೆಗಳ ಕಥೆ (A Story of Numbers)',
    titleEn: 'Chapter 03: A Story of Numbers',
    conceptKn:
      'ಸಂಖ್ಯಾ ಪದ್ಧತಿಗಳ ಬೆಳವಣಿಗೆ, ಸ್ಥಾನಬೆಲೆ (place value), ಸೊನ್ನೆಯ ಮಹತ್ವ ಮತ್ತು ವಿವಿಧ ಸಂಸ್ಕೃತಿಗಳ ಸಂಕೇತಗಳು.',
    conceptEn:
      'Historical development of number systems, place value, the role of zero, and numeral systems across cultures.',
    hintKn:
      'ಪ್ರತಿ ಸ್ಥಾನದ ಬೆಲೆಯನ್ನು ಅದರ ಸ್ಥಾನಬೆಲೆ (ಒಂದು, ಹತ್ತು, ನೂರು...) ಆಧಾರವಾಗಿ ಗುಣಿಸಿ.',
    hintEn:
      'Multiply each digit by its place value position (ones, tens, hundreds, etc.).',
    quizQ: 'What is the place value of 7 in 5,742? (5,742 ರಲ್ಲಿ 7ರ ಸ್ಥಾನಬೆಲೆ ಎಷ್ಟು?)',
    wrongOpt: '70',
    correctOpt: '700',
    explanationKn: '7 ನೂರರ ಸ್ಥಾನದಲ್ಲಿದೆ, ಆದ್ದರಿಂದ ಅದರ ಸ್ಥಾನಬೆಲೆ 700.',
    explanationEn: '7 is in the hundreds place, so its place value is 700.'
  },
  {
    id: 'ch4',
    titleKn: 'ಅಧ್ಯಾಯ 04: ಚತುರ್ಭುಜಗಳು (Quadrilaterals)',
    titleEn: 'Chapter 04: Quadrilaterals',
    conceptKn:
      'ಚತುರ್ಭುಜಗಳ ಗುಣಲಕ್ಷಣಗಳು ಮತ್ತು ವರ್ಗೀಕರಣ (ಸಮಾಂತರ ಚತುರ್ಭುಜ, ಆಯತ, ಚೌಕ, ವಜ್ರಾಕೃತಿ, ತ್ರಾಪಿಜ್ಯ) ಹಾಗೂ ಒಳಕೋನಗಳ ಮೊತ್ತ 360°.',
    conceptEn:
      'Properties and classification of quadrilaterals—parallelograms, rectangles, squares, rhombuses, trapeziums—and the 360° angle sum property.',
    hintKn:
      'ಚತುರ್ಭುಜದ ನಾಲ್ಕು ಒಳಕೋನಗಳ ಮೊತ್ತ 360°; ಕೊಟ್ಟ ಕೋನಗಳನ್ನು ಕೂಡಿ 360° ನಿಂದ ಕಳೆಯಿರಿ.',
    hintEn:
      'Interior angles of a quadrilateral add up to 360°. Subtract the sum of known angles from 360°.',
    quizQ:
      'If three angles of a quadrilateral are 80°, 90°, and 100°, what is the 4th angle?',
    wrongOpt: '110°',
    correctOpt: '90°',
    explanationKn: '360° - (80° + 90° + 100°) = 360° - 270° = 90°.',
    explanationEn: '360° - (80° + 90° + 100°) = 360° - 270° = 90°.'
  },
  {
    id: 'ch5',
    titleKn: 'ಅಧ್ಯಾಯ 05: ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಆಟ (Number Play)',
    titleEn: 'Chapter 05: Number Play',
    conceptKn:
      'ಭಾಜ್ಯತೆಯ ನಿಯಮಗಳು (2, 3, 5, 9, 10), ಅನುಕ್ರಮ ಸಂಖ್ಯೆಗಳ ಮೊತ್ತ ಮತ್ತು ಸಂಖ್ಯಾ ಒಗಟುಗಳು.',
    conceptEn:
      'Divisibility rules, sums of consecutive numbers, and number puzzles linking arithmetic and algebra.',
    hintKn:
      'ಅಂಕಿಗಳ ಮೊತ್ತವು 3 ರಿಂದ ಭಾಗವಾಗುತ್ತದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ (3ರ ಭಾಜ್ಯತೆಯ ನಿಯಮ).',
    hintEn:
      'Check if the sum of the digits is divisible by 3 using the divisibility rule for 3.',
    quizQ: 'Is 426 divisible by 3? (426 ಸಂಖ್ಯೆಯು 3ರಿಂದ ಭಾಗವಾಗುತ್ತದೆಯೇ?)',
    wrongOpt: 'No',
    correctOpt: 'Yes',
    explanationKn: '4 + 2 + 6 = 12, ಮತ್ತು 12 ಅನ್ನು 3 ರಿಂದ ಭಾಗಿಸಬಹುದು (12 ÷ 3 = 4).',
    explanationEn: '4 + 2 + 6 = 12, which is divisible by 3.'
  },
  {
    id: 'ch6',
    titleKn: 'ಅಧ್ಯಾಯ 06: ವಿಭಾಜಕ ಗುಣ ಮತ್ತು ಗುಣಾಕಾರ (We Distribute, Yet Things Multiply)',
    titleEn: 'Chapter 06: We Distribute, Yet Things Multiply',
    conceptKn:
      'ವಿಭಾಜಕ ಗುಣ (distributive law), ಬೀಜಗಣಿತದ ಗುಣಾಕಾರ ಮತ್ತು ಪ್ರಮುಖ ನಿತ್ಯಸಮೀಕರಣಗಳು: (a+b)², (a-b)², (a+b)(a-b).',
    conceptEn:
      'Distributive law, expanding algebraic products, and identities including (a+b)², (a-b)², and (a+b)(a-b).',
    hintKn: '(a + b)² = a² + 2ab + b² ಸೂತ್ರವನ್ನು ಬಳಸಿ.',
    hintEn: 'Apply the identity (a + b)² = a² + 2ab + b².',
    quizQ: 'Expand (x + 3)² ((x + 3)² ವಿಸ್ತರಿಸಿ)',
    wrongOpt: 'x² + 9',
    correctOpt: 'x² + 6x + 9',
    explanationKn: '(x + 3)² = x² + 2(x)(3) + 3² = x² + 6x + 9.',
    explanationEn: '(x + 3)² = x² + 2(x)(3) + 3² = x² + 6x + 9.'
  },
  {
    id: 'ch7',
    titleKn: 'ಅಧ್ಯಾಯ 07: ಅನುಪಾತ ಮತ್ತು ಪ್ರಮಾಣ - 1 (Proportional Reasoning - 1)',
    titleEn: 'Chapter 07: Proportional Reasoning - 1',
    conceptKn:
      'ಅನುಪಾತ (ratio), ಪ್ರಮಾಣ (proportion), ತ್ರೈರಾಶಿಕ ನಿಯಮ ಮತ್ತು ನೀಡಿದ ಅನುಪಾತದಲ್ಲಿ ಮೊತ್ತವನ್ನು ಹಂಚುವುದು.',
    conceptEn:
      'Ratios, checking proportionality, unitary/rule-of-three methods, and sharing quantities in a given ratio.',
    hintKn: 'ಮೊದಲು ಅನುಪಾತದ ಭಾಗಗಳ ಮೊತ್ತವನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ (ಉದಾ: 2 + 3 = 5).',
    hintEn:
      'First find the total number of ratio parts (for example, 2 + 3 = 5 parts).',
    quizQ: 'Divide ₹100 in the ratio 2 : 3. What is the larger share?',
    wrongOpt: '₹40',
    correctOpt: '₹60',
    explanationKn: 'ಒಟ್ಟು ಭಾಗಗಳು = 2 + 3 = 5. ದೊಡ್ಡ ಭಾಗ = (3/5) × 100 = ₹60.',
    explanationEn: 'Total parts = 2 + 3 = 5. Larger share = (3/5) × 100 = ₹60.'
  },
  {
    id: 'ch8',
    titleKn: 'ಅಧ್ಯಾಯ 08: ಭಿನ್ನರಾಶಿಗಳ ವಿಭಿನ್ನ ರೂಪಗಳು (Fractions in Disguise)',
    titleEn: 'Chapter 08: Fractions in Disguise',
    conceptKn:
      'ಭಿನ್ನರಾಶಿಗಳು, ದಶಮಾಂಶಗಳು ಮತ್ತು ಶೇಕಡಾವಾರು ಪರಿವರ್ತನೆ, ಲಾಭ-ನಷ್ಟ, ತೆರಿಗೆ ಮತ್ತು ಚಕ್ರಬಡ್ಡಿ/ಮೌಲ್ಯಹ್ರಾಸ.',
    conceptEn:
      'Converting between fractions, decimals, and percentages; percentage change, profit and loss, and everyday applications.',
    hintKn: 'ಶೇಕಡಾವಾರು ಕಂಡುಹಿಡಿಯಲು ಭಿನ್ನರಾಶಿಯನ್ನು 100 ರಿಂದ ಗುಣಿಸಿ.',
    hintEn: 'Multiply the fraction by 100 to convert it into a percentage.',
    quizQ: 'What is 3/4 as a percentage? (3/4 ಅನ್ನು ಶೇಕಡಾವಾರಿನಲ್ಲಿ ಬರೆಯಿರಿ)',
    wrongOpt: '25%',
    correctOpt: '75%',
    explanationKn: '(3/4) × 100% = 75%.',
    explanationEn: '(3/4) × 100% = 75%.'
  },
  {
    id: 'ch9',
    titleKn: 'ಅಧ್ಯಾಯ 09: ಬೌಧಾಯನ - ಪೈಥಾಗರಸ್ ಪ್ರಮೇಯ (The Baudhayana-Pythagoras Theorem)',
    titleEn: 'Chapter 09: The Baudhayana-Pythagoras Theorem',
    conceptKn:
      'ಲಂಬಕೋನ ತ್ರಿಭುಜದಲ್ಲಿ ಕರ್ಣದ ವರ್ಗವು ಇತರ ಎರಡು ಬಾಹುಗಳ ವರ್ಗಗಳ ಮೊತ್ತಕ್ಕೆ ಸಮಾನವಾಗಿರುತ್ತದೆ: c² = a² + b².',
    conceptEn:
      'In a right-angled triangle, the square on the hypotenuse equals the sum of squares on the other two sides: c² = a² + b².',
    hintKn: 'a² + b² ಕಂಡುಹಿಡಿದ ನಂತರ ಅದರ ವರ್ಗಮೂಲ (square root) ತೆಗೆದುಕೊಳ್ಳಿ.',
    hintEn:
      'Compute a² + b² first, then take the square root to get the hypotenuse.',
    quizQ:
      'In a right triangle with legs 3 cm and 4 cm, what is the hypotenuse?',
    wrongOpt: '7 cm',
    correctOpt: '5 cm',
    explanationKn: '√(3² + 4²) = √(9 + 16) = √25 = 5 cm.',
    explanationEn: '√(3² + 4²) = √(9 + 16) = √25 = 5 cm.'
  },
  {
    id: 'ch10',
    titleKn: 'ಅಧ್ಯಾಯ 10: ಅನುಪಾತ ಮತ್ತು ಪ್ರಮಾಣ - 2 (Proportional Reasoning - 2)',
    titleEn: 'Chapter 10: Proportional Reasoning - 2',
    conceptKn:
      'ನೇರ ಪ್ರಮಾಣ (direct proportion) ಮತ್ತು ವಿಲೋಮ ಪ್ರಮಾಣ (inverse proportion) ಹಾಗೂ ಸಂಬಂಧಿತ ಸಮಸ್ಯೆಗಳು.',
    conceptEn:
      'Direct and inverse proportion relationships and solving word problems with both.',
    hintKn:
      'ಒಂದು ಹೆಚ್ಚಾದಾಗ ಇನ್ನೊಂದು ಕಡಿಮೆಯಾದರೆ ಅದು ವಿಲೋಮ ಪ್ರಮಾಣ (x₁ × y₁ = x₂ × y₂).',
    hintEn:
      'If one quantity increases while the other decreases proportionally, use inverse proportion (x₁y₁ = x₂y₂).',
    quizQ:
      'If 4 workers take 6 days to finish a wall, how many days will 8 workers take at the same rate?',
    wrongOpt: '12 days',
    correctOpt: '3 days',
    explanationKn: '4 × 6 = 24 ಕೆಲಸದ ದಿನಗಳು; 8 ಜನರಿಗೆ 24 ÷ 8 = 3 ದಿನಗಳು.',
    explanationEn:
      'Total work = 4 × 6 = 24 worker-days; 8 workers take 24 ÷ 8 = 3 days.'
  },
  {
    id: 'ch11',
    titleKn: 'ಅಧ್ಯಾಯ 11: ಜ್ಯಾಮಿತೀಯ ವಿಷಯಗಳ ಅನ್ವೇಷಣೆ (Exploring Some Geometric Themes)',
    titleEn: 'Chapter 11: Exploring Some Geometric Themes',
    conceptKn:
      'ಘನಾಕೃತಿಗಳ ಜಾಲ (nets of solids), ಐಸೊಮೆಟ್ರಿಕ್ ಚಿತ್ರಣ ಮತ್ತು ಜ್ಯಾಮಿತೀಯ ಮಾದರಿಗಳು.',
    conceptEn:
      'Nets of 3D solids, isometric views, visualising solids, and geometric patterns.',
    hintKn: 'ಘನದ (cube) ಮುಖಗಳ ಸಂಖ್ಯೆ 6, ಅಂಚುಗಳ ಸಂಖ್ಯೆ 12 ಮತ್ತು ಶೃಂಗಗಳ ಸಂಖ್ಯೆ 8.',
    hintEn: 'A cube has 6 faces, 12 edges, and 8 vertices.',
    quizQ: 'How many faces does a standard cube have? (ಘನಾಕೃತಿಗೆ ಎಷ್ಟು ಮುಖಗಳಿವೆ?)',
    wrongOpt: '4',
    correctOpt: '6',
    explanationKn: 'ಒಂದು ಘನಕ್ಕೆ (cube) 6 ಸಮಚೌಕಾಕಾರದ ಮುಖಗಳಿರುತ್ತವೆ.',
    explanationEn: 'A cube has 6 square faces.'
  },
  {
    id: 'ch12',
    titleKn: 'ಅಧ್ಯಾಯ 12: ಚುಕ್ಕೆ ಮತ್ತು ರೇಖೆಗಳ ಕಥೆ (Tales by Dots and Lines)',
    titleEn: 'Chapter 12: Tales by Dots and Lines',
    conceptKn:
      'ಸರಾಸರಿ (mean), ಮಧ್ಯಕ (median), ಸ್ತಂಭ ನಕ್ಷೆ (bar graph), ರೇಖಾ ನಕ್ಷೆ ಮತ್ತು ವೃತ್ತ ನಕ್ಷೆ (pie chart) ಮೂಲಕ ದತ್ತಾಂಶ ವಿಶ್ಲೇಷಣೆ.',
    conceptEn:
      'Data handling with mean and median, pictographs, bar graphs, line graphs, and pie charts.',
    hintKn: 'ಸರಾಸರಿ = (ಎಲ್ಲಾ ದತ್ತಾಂಶಗಳ ಮೊತ್ತ) ÷ (ಒಟ್ಟು ಸಂಖ್ಯೆಗಳ ಎಣಿಕೆ).',
    hintEn: 'Mean = (Sum of observations) ÷ (Number of observations).',
    quizQ: 'What is the mean of 10, 20, and 30? (10, 20 ಮತ್ತು 30ರ ಸರಾಸರಿ ಎಷ್ಟು?)',
    wrongOpt: '15',
    correctOpt: '20',
    explanationKn: '(10 + 20 + 30) ÷ 3 = 60 ÷ 3 = 20.',
    explanationEn: '(10 + 20 + 30) ÷ 3 = 60 ÷ 3 = 20.'
  },
  {
    id: 'ch13',
    titleKn: 'ಅಧ್ಯಾಯ 13: ಬೀಜಗಣಿತದ ಆಟ (Algebra Play)',
    titleEn: 'Chapter 13: Algebra Play',
    conceptKn:
      'ಸಂಖ್ಯಾ ಮತ್ತು ದೃಶ್ಯ ಮಾದರಿಗಳನ್ನು ಬೀಜಗಣಿತದ ಪದಗಳಿಂದ ಸಾಮಾನ್ಯೀಕರಿಸುವುದು ಮತ್ತು ಸಮೀಕರಣಗಳ ಮೂಲಕ ಒಗಟು ಬಿಡಿಸುವುದು.',
    conceptEn:
      'Generalising number and visual patterns using algebraic expressions and solving algebraic puzzles.',
    hintKn:
      'n-ನೇ ಪದವನ್ನು ಕಂಡುಹಿಡಿಯಲು ಸ್ಥಾನ ಸಂಖ್ಯೆ (n) ಮತ್ತು ಸ್ಥಿರ ವ್ಯತ್ಯಾಸದ ಸಂಬಂಧವನ್ನು ಗಮನಿಸಿ.',
    hintEn:
      'Relate the term position n to the constant step change across terms.',
    quizQ: 'If the nth term of a pattern is 2n + 1, what is the 4th term?',
    wrongOpt: '7',
    correctOpt: '9',
    explanationKn: 'n = 4 ಆದಾಗ: 2(4) + 1 = 8 + 1 = 9.',
    explanationEn: 'Substitute n = 4 into 2n + 1: 2(4) + 1 = 9.'
  },
  {
    id: 'ch14',
    titleKn: 'ಅಧ್ಯಾಯ 14: ವಿಸ್ತೀರ್ಣ (Area)',
    titleEn: 'Chapter 14: Area',
    conceptKn:
      'ತ್ರಿಭುಜ, ಆಯತ, ಚೌಕ, ಸಮಾಂತರ ಚತುರ್ಭುಜ, ವಜ್ರಾಕೃತಿ ಮತ್ತು ತ್ರಾಪಿಜ್ಯಗಳ ವಿಸ್ತೀರ್ಣ ಸೂತ್ರಗಳು ಹಾಗೂ ಸಂಯುಕ್ತ ಆಕೃತಿಗಳ ವಿಸ್ತೀರ್ಣ.',
    conceptEn:
      'Area formulas for triangles, rectangles, squares, parallelograms, rhombuses, trapeziums, and composite shapes.',
    hintKn: 'ತ್ರಿಭುಜದ ವಿಸ್ತೀರ್ಣ = ½ × ಪಾದ × ಎತ್ತರ.',
    hintEn: 'Area of a triangle = ½ × base × height.',
    quizQ: 'Find the area of a triangle with base 10 cm and height 6 cm.',
    wrongOpt: '60 cm²',
    correctOpt: '30 cm²',
    explanationKn: 'ವಿಸ್ತೀರ್ಣ = ½ × 10 × 6 = 30 cm².',
    explanationEn: 'Area = ½ × 10 × 6 = 30 cm².'
  }
];

export default function App() {
  const [stage, setStage] = useState('welcome');
  const [lang, setLang] = useState('kn');
  const [activeTab, setActiveTab] = useState('textbook');

  const [userAccount, setUserAccount] = useState({
    id: 'vidyasetu-user',
    fullName: 'Kavya R',
    role: 'student',
    preferredLang: 'kn'
  });

  const [savedProfile, setSavedProfile] = useState(() => {
    try {
      const raw = localStorage.getItem('vs_personal_profile_v1');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [chapterIdx, setChapterIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizMsg, setQuizMsg] = useState('');
  const [xp, setXp] = useState(320);
  const [mistakes, setMistakes] = useState([
    {
      id: 'init-c8-1',
      topic: 'Chapter 04: Quadrilaterals',
      question:
        'If three angles of a quadrilateral are 80°, 90°, and 100°, what is the 4th angle?',
      wrongAnswer: '110°',
      correctAnswer: '90°',
      hintKn: 'ಚತುರ್ಭುಜದ ನಾಲ್ಕು ಒಳಕೋನಗಳ ಮೊತ್ತ 360°; ಕೊಟ್ಟ ಕೋನಗಳನ್ನು ಕೂಡಿ 360° ನಿಂದ ಕಳೆಯಿರಿ.',
      hintEn:
        'Interior angles of a quadrilateral add up to 360°. Subtract the sum of known angles from 360°.'
    }
  ]);

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lowDataMode, setLowDataMode] = useState(false);
  const [offlineReady, setOfflineReady] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState('Saved locally');

  const [completedChapters, setCompletedChapters] = useState(['ch1']);
  const [masteredTopics, setMasteredTopics] = useState([
    'Chapter 01: A Square and A Cube'
  ]);
  const [weakTopics, setWeakTopics] = useState(['Chapter 04: Quadrilaterals']);
  const [adaptiveMode, setAdaptiveMode] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome-ai',
      sender: 'ai',
      textKn:
        'ನಮಸ್ಕಾರ! ನಾನು ವಿದ್ಯಾ AI. 8ನೇ ತರಗತಿ ಗಣಿತದ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಅಥವಾ ಸಂದೇಹವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ (ಪಠ್ಯ, ಧ್ವನಿ ಅಥವಾ ಫೋಟೋ ಮೂಲಕ).',
      textEn:
        'Hello! I am Vidya AI. Ask any Class 8 Maths doubt via text, voice, or photo upload.'
    }
  ]);
  const [uploadedPhotoName, setUploadedPhotoName] = useState('');
  const [uploadedPhotoPreview, setUploadedPhotoPreview] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('');
  const [understandingCheck, setUnderstandingCheck] = useState(null);

  useEffect(() => {
    if (savedProfile) {
      localStorage.setItem('vs_personal_profile_v1', JSON.stringify(savedProfile));
    }
  }, [savedProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'vs_offline_class8_pack_v1',
        JSON.stringify(CLASS8_CHAPTERS)
      );
      setOfflineReady(true);
    } catch {
      setOfflineReady(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setPendingSyncCount((prev) => {
        if (prev > 0) {
          setLastSyncedAt(new Date().toLocaleTimeString());
        }
        return 0;
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const persistProgressLocally = (
    nextXp,
    nextMistakes,
    nextCompleted,
    nextWeak
  ) => {
    try {
      localStorage.setItem(
        'vs_c8_progress_v1',
        JSON.stringify({
          xp: nextXp,
          mistakes: nextMistakes,
          completedChapters: nextCompleted,
          weakTopics: nextWeak,
          updatedAt: new Date().toISOString()
        })
      );
    } catch {
      // Ignore storage quota errors
    }

    if (navigator.onLine) {
      setPendingSyncCount(0);
      setLastSyncedAt(`Synced ${new Date().toLocaleTimeString()}`);
    } else {
      setPendingSyncCount((c) => c + 1);
      setLastSyncedAt('Saved offline (queued for sync)');
    }
  };

  const handleManualSync = () => {
    setPendingSyncCount(0);
    setLastSyncedAt(`Synced ${new Date().toLocaleTimeString()}`);
  };

  const handleContinueFromWelcome = () => {
    setStage('profile');
  };

  const handleCompleteProfile = (completedData) => {
    setSavedProfile(completedData);
    const nextRole = completedData.role || userAccount.role;
    setUserAccount((prev) => ({
      ...prev,
      fullName: completedData.fullName || prev.fullName,
      role: nextRole,
      preferredLang: completedData.learningLang || lang
    }));

    setActiveTab('textbook');
    setStage('dashboard');
  };

  if (stage === 'welcome') {
    return (
      <WelcomeAuthPage
        lang={lang}
        onChangeLang={setLang}
        onContinueToProfile={({ fullName, role, preferredLang }) => {
          if (preferredLang) setLang(preferredLang);
          setUserAccount((prev) => ({
            ...prev,
            fullName: fullName || prev.fullName,
            role: role || prev.role,
            preferredLang: preferredLang || lang
          }));
          setStage('profile');
        }}
      />
    );
  }

  if (stage === 'profile') {
    return (
      <ProfilePersonalise
        lang={lang}
        onChangeLang={setLang}
        user={userAccount}
        existingProfile={savedProfile}
        onBack={() => setStage('welcome')}
        onCompleteProfile={handleCompleteProfile}
      />
    );
  }

  const displayName = savedProfile?.fullName || userAccount.fullName;
  const activeRole = savedProfile?.role || userAccount.role;
  const chapter = CLASS8_CHAPTERS[chapterIdx];

  const handleMarkChapterCompleted = () => {
    if (!completedChapters.includes(chapter.id)) {
      const updated = [...completedChapters, chapter.id];
      const nextXp = xp + 40;
      setCompletedChapters(updated);
      setMasteredTopics((prev) =>
        prev.includes(chapter.titleEn) ? prev : [...prev, chapter.titleEn]
      );
      setXp(nextXp);
      persistProgressLocally(nextXp, mistakes, updated, weakTopics);
    }
  };

  const buildTutorReply = (questionText, hasPhoto) => {
    const prefixKn = hasPhoto ? 'ಫೋಟೋ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ — ' : '';
    const prefixEn = hasPhoto ? 'Regarding the uploaded photo question — ' : '';

    return {
      kn: `${prefixKn}${chapter.titleKn}: ${chapter.conceptKn} ಸುಳಿವು: ${chapter.hintKn} ವಿವರಣೆ: ${chapter.explanationKn} ನಿಮಗೆ ಈ ಹಂತಗಳು ಅರ್ಥವಾದವೇ?`,
      en: `${prefixEn}${chapter.titleEn}: ${chapter.conceptEn} Hint: ${chapter.hintEn} Explanation: ${chapter.explanationEn} Did these steps make sense?`
    };
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed && !uploadedPhotoName) return;

    const userText =
      trimmed ||
      (lang === 'kn'
        ? `ಫೋಟೋ ಪ್ರಶ್ನೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ: ${uploadedPhotoName}`
        : `Uploaded photo question: ${uploadedPhotoName}`);

    const reply = buildTutorReply(
      trimmed || chapter.titleEn,
      Boolean(uploadedPhotoName)
    );

    setChatMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        sender: 'user',
        textKn: userText,
        textEn: userText,
        photoPreview: !lowDataMode ? uploadedPhotoPreview : ''
      },
      {
        id: `a-${Date.now() + 1}`,
        sender: 'ai',
        textKn: reply.kn,
        textEn: reply.en
      }
    ]);
    setChatInput('');
    setUnderstandingCheck(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedPhotoName(file.name);
    if (!lowDataMode) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPhotoPreview(
          typeof reader.result === 'string' ? reader.result : ''
        );
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedPhotoPreview('');
    }
  };

  const handleVoiceInput = () => {
    const SpeechRec =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRec) {
      setVoiceStatus(
        lang === 'kn'
          ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ; ದಯವಿಟ್ಟು ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ.'
          : 'Browser speech recognition is unavailable here; please type your question.'
      );
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setVoiceStatus(
        lang === 'kn' ? 'ಮಾತನಾಡಿ... ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ' : 'Listening... speak now'
      );

      recognition.onresult = (event) => {
        const spoken = event.results?.[0]?.[0]?.transcript || '';
        setChatInput((prev) => (prev ? `${prev} ${spoken}` : spoken));
        setVoiceStatus(
          lang === 'kn' ? `ಗುರುತಿಸಲಾದ ಧ್ವನಿ: "${spoken}"` : `Heard: "${spoken}"`
        );
      };

      recognition.onerror = () => {
        setVoiceStatus(
          lang === 'kn'
            ? 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪೂರ್ಣಗೊಳ್ಳಲಿಲ್ಲ (ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ಅಥವಾ ಸೇವೆ ಪರೀಕ್ಷಿಸಿ).'
            : 'Voice capture did not complete (check mic permission or speech service).'
        );
      };

      recognition.start();
    } catch {
      setVoiceStatus(
        lang === 'kn'
          ? 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಆರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.'
          : 'Could not start voice input.'
      );
    }
  };

  const handleUnderstandingResponse = (understood) => {
    setUnderstandingCheck(understood ? 'yes' : 'no');
    if (!understood) {
      setAdaptiveMode(true);
      if (!weakTopics.includes(chapter.titleEn)) {
        const nextWeak = [...weakTopics, chapter.titleEn];
        setWeakTopics(nextWeak);
        persistProgressLocally(xp, mistakes, completedChapters, nextWeak);
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: `u-check-${Date.now()}`,
          sender: 'ai',
          textKn: `ಸರಿ, ಇನ್ನಷ್ಟು ಸುಲಭವಾಗಿ ನೋಡೋಣ: ${chapter.hintKn} ಈಗ ಅಭ್ಯಾಸ ವಿಭಾಗದಲ್ಲಿ ಸುಲಭ ಹಂತದ ಪ್ರಶ್ನೆ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.`,
          textEn: `Let's break it down more simply: ${chapter.hintEn} Targeted practice is now highlighted in the Practice tab.`
        }
      ]);
    } else {
      const nextXp = xp + 15;
      setXp(nextXp);
      persistProgressLocally(nextXp, mistakes, completedChapters, weakTopics);
    }
  };

  const handleQuizChoice = (choice) => {
    if (choice === chapter.correctOpt) {
      const nextXp = xp + 25;
      const nextWeak = weakTopics.filter((t) => t !== chapter.titleEn);
      setXp(nextXp);
      setWeakTopics(nextWeak);
      setMasteredTopics((prev) =>
        prev.includes(chapter.titleEn) ? prev : [...prev, chapter.titleEn]
      );
      setQuizMsg(
        lang === 'kn'
          ? `ಸರಿ ಉತ್ತರ! +25 XP. ${chapter.explanationKn}`
          : `Correct! +25 XP. ${chapter.explanationEn}`
      );
      persistProgressLocally(nextXp, mistakes, completedChapters, nextWeak);
    } else {
      const nextMistakes = [
        {
          id: String(Date.now()),
          topic: lang === 'kn' ? chapter.titleKn : chapter.titleEn,
          question: chapter.quizQ,
          wrongAnswer: choice,
          correctAnswer: chapter.correctOpt,
          hintKn: chapter.hintKn,
          hintEn: chapter.hintEn
        },
        ...mistakes
      ];
      const nextWeak = weakTopics.includes(chapter.titleEn)
        ? weakTopics
        : [...weakTopics, chapter.titleEn];
      setMistakes(nextMistakes);
      setWeakTopics(nextWeak);
      setAdaptiveMode(true);
      setQuizMsg(
        lang === 'kn'
          ? `ತಪ್ಪು ಪತ್ತೆಯಾಗಿದೆ ಮತ್ತು ನೆನಪಿನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ! ಹೊಂದಾಣಿಕೆಯ ಸುಳಿವು: ${chapter.hintKn}`
          : `Mistake detected & saved! Adaptive hint: ${chapter.hintEn}`
      );
      persistProgressLocally(xp, nextMistakes, completedChapters, nextWeak);
    }
  };

  return (
    <VidyaSetuDashboard
      lang={lang}
      onChangeLang={setLang}
      userName={displayName}
      role={activeRole}
      schoolName={savedProfile?.schoolName || ''}
      chapters={CLASS8_CHAPTERS}
      chapterIdx={chapterIdx}
      onSelectChapter={(idx) => {
        setChapterIdx(idx);
        setShowHint(false);
        setQuizMsg('');
      }}
      onMarkChapterDone={handleMarkChapterCompleted}
      completedChapters={completedChapters}
      xp={xp}
      mistakes={mistakes}
      weakTopics={weakTopics}
      masteredTopics={masteredTopics}
      chatMessages={chatMessages}
      chatInput={chatInput}
      onChatInputChange={setChatInput}
      onSendChat={handleSendChat}
      onVoiceInput={handleVoiceInput}
      onPhotoUpload={handlePhotoChange}
      uploadedPhotoName={uploadedPhotoName}
      voiceStatus={voiceStatus}
      onQuizChoice={handleQuizChoice}
      quizMsg={quizMsg}
      onGoToProfile={() => setStage('profile')}
      onGoToWelcome={() => setStage('welcome')}
    />
  );
}