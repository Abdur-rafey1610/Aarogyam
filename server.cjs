const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle incoming calls from Twilio
app.post('/ivr/welcome', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say({ language: 'en-IN' }, '<speak>Welcome to <phoneme alphabet="ipa" ph="ɑːˈɾoːɡjəm">Aarogyam</phoneme>.</speak>');
  const gather = twiml.gather({
    numDigits: 1,
    action: '/ivr/handle-language-selection',
    method: 'POST',
  });
  gather.say({ language: 'en-IN' }, 'For English, press 1.');
  gather.say({ language: 'hi-IN' }, 'हिंदी के लिए, 2 दबाएं।');
  gather.say({ language: 'te-IN' }, 'తెలుగు కోసం, 3 నొక్కండి।');

  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/ivr/handle-language-selection', (req, res) => {
  const language = req.body.Digits;
  const twiml = new twilio.twiml.VoiceResponse();
  const abhaId = '63047337131610'; // Hardcoded ABHA ID

  const gather = twiml.gather({
    numDigits: 1,
    action: `/ivr/handle-menu-selection?abhaId=${abhaId}&language=${language}`,
    method: 'POST',
  });

  if (language === '1') {
    gather.say({ language: 'en-IN' }, 'Abdur Rafey, ABHA ID 6 3 0 4 7 3 3 7 1 3 1 6 1 0.');
    gather.say({ language: 'en-IN' }, 'Press 1 to listen to your latest prescription. Press 2 to listen to your emergency medical information. Press 3 for lab reports. Press 4 for family reports. Press 5 for public alerts.');
  } else if (language === '2') {
    gather.say({ language: 'hi-IN' }, 'अब्दुर राफे, आभा आईडी 6 3 0 4 7 3 3 7 1 3 1 6 1 0।');
    gather.say({ language: 'hi-IN' }, 'अपना नवीनतम डॉक्टर का पर्चा सुनने के लिए 1 दबाएं। अपनी emergency details सुनने के लिए 2 दबाएं। लैब रिपोर्ट के लिए 3 दबाएं। पारिवारिक रिपोर्ट के लिए 4 दबाएं। सार्वजनिक अलर्ट के लिए 5 दबाएं।');
  } else if (language === '3') {
    gather.say({ language: 'te-IN' }, 'అబ్దుర్ రాఫే, ఆభా ఐడి 6 3 0 4 7 3 3 7 1 3 1 6 1 0।');
    gather.say({ language: 'te-IN' }, 'మీ తాజా ప్రిస్క్రిప్షన్ వినడానికి 1 నొక్కండి. మీ అత్యవసర వివరాలు వినడానికి 2 నొక్కండి. ల్యాబ్ నివేదికల కోసం 3 నొక్కండి. కుటుంబ నివేదికల కోసం 4 నొక్కండి. ప్రజా హెచ్చరికల కోసం 5 నొక్కండి。');
  } else {
    twiml.say({ language: 'en-IN' }, 'Invalid selection.');
    twiml.redirect('/ivr/welcome');
    res.type('text/xml');
    res.send(twiml.toString());
    return;
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Handle the ABHA ID input


const translateInstruction = (instruction, language) => {
    if (language === 'hi-IN') {
        switch (instruction) {
            case 'After meals':
                return 'खाने के बाद';
            case 'Before bedtime':
                return 'सोने से पहले';
            case 'Morning, with water':
                return 'सुबह, पानी के साथ';
            case 'On affected area only':
                return 'केवल प्रभावित क्षेत्र पर';
            case 'With or without food':
                return 'भोजन के साथ या बिना';
            case 'With breakfast':
                return 'नाश्ते के साथ';
            case 'With milk or after meal':
                return 'दूध के साथ या भोजन के बाद';
            default:
                return instruction;
        }
    } else if (language === 'te-IN') {
        switch (instruction) {
            case 'After meals':
                return 'భోజనం తర్వాత';
            case 'Before bedtime':
                return 'నిద్రపోయే ముందు';
            case 'Morning, with water':
                return 'ఉదయం, నీటితో';
            case 'On affected area only':
                return 'ప్రభావిత ప్రాంతంలో మాత్రమే';
            case 'With or without food':
                return 'భోజనంతో లేదా లేకుండా';
            case 'With breakfast':
                return 'అల్పాహారంతో';
            case 'With milk or after meal':
                return 'పాలతో లేదా భోజనం తర్వాత';
            default:
                return instruction;
        }
    }
    return instruction;
};

const translateDuration = (duration, language) => {
    if (language === 'hi-IN') {
        if (duration === 'Ongoing') {
            return 'चल रहा है';
        }
        const parts = duration.split(' ');
        if (parts.length === 2) {
            const value = parts[0];
            const unit = parts[1];
            if (unit === 'days' || unit === 'day') {
                return `${value} दिन`;
            }
            if (unit === 'weeks' || unit === 'week') {
                return `${value} हफ्ते`;
            }
        }
    } else if (language === 'te-IN') {
        if (duration === 'Ongoing') {
            return 'కొనసాగుతోంది';
        }
        const parts = duration.split(' ');
        if (parts.length === 2) {
            const value = parts[0];
            const unit = parts[1];
            if (unit === 'days' || unit === 'day') {
                return `${value} రోజులు`;
            }
            if (unit === 'weeks' || unit === 'week') {
                return `${value} వారాలు`;
            }
        }
    }
    return duration;
};

const translateFrequency = (frequency, language) => {
    if (language === 'hi-IN') {
        switch (frequency) {
            case 'Twice daily':
                return 'दिन में दो बार';
            case 'Once daily':
                return 'दिन में एक बार';
            case 'Three times daily':
                return 'दिन में तीन बार';
            case 'Once weekly':
                return 'हफ्ते में एक बार';
            default:
                return frequency;
        }
    } else if (language === 'te-IN') {
        switch (frequency) {
            case 'Twice daily':
                return 'రోజుకు రెండుసార్లు';
            case 'Once daily':
                return 'రోజుకు ఒకసారి';
            case 'Three times daily':
                return 'రోజుకు మూడుసార్లు';
            case 'Once weekly':
                return 'వారానికి ఒకసారి';
            default:
                return frequency;
        }
    }
    return frequency;
};

const translateNumberToHindi = (text) => {
    const hindiDigits = {
        '0': 'शून्य',
        '1': 'एक',
        '2': 'दो',
        '3': 'तीन',
        '4': 'चार',
        '5': 'पांच',
        '6': 'छह',
        '7': 'सात',
        '8': 'आठ',
        '9': 'नौ'
    };
    return text.replace(/\d/g, (digit) => hindiDigits[digit] || digit);
};

const translateNumberToTelugu = (text) => {
    const teluguDigits = {
        '0': 'సున్నా',
        '1': 'ఒకటి',
        '2': 'రెండు',
        '3': 'మూడు',
        '4': 'నాలుగు',
        '5': 'ఐదు',
        '6': 'ఆరు',
        '7': 'ఏడు',
        '8': 'ఎనిమిది',
        '9': 'తొమ్మిది'
    };
    return text.replace(/\d/g, (digit) => teluguDigits[digit] || digit);
};

const prescriptions = [
    {
      id: 1,
      doctor: 'Dr. Priya Sharma',
      date: '2024-09-16',
      status: 'Active',
      medications: [
        {
          name: 'Paracetamol 500mg',
          dosage: '1 tablet',
          frequency: 'Twice daily',
          duration: '5 days',
          instructions: 'After meals',
          remaining: 3
        },
        {
          name: 'Cetirizine 10mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '7 days',
          instructions: 'Before bedtime',
          remaining: 5
        }
      ]
    },
    {
      id: 2,
      doctor: 'Dr. Rajesh Kumar',
      date: '2024-09-10',
      status: 'Active',
      medications: [
        {
          name: 'Amlodipine 5mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: 'Ongoing',
          instructions: 'Morning, with water',
          remaining: 25
        }
      ]
    },
    {
      id: 3,
      doctor: 'Dr. Sunita Verma',
      date: '2024-09-05',
      status: 'Completed',
      medications: [
        {
          name: 'Hydrocortisone Cream',
          dosage: 'Apply thin layer',
          frequency: 'Twice daily',
          duration: '10 days',
          instructions: 'On affected area only',
          remaining: 0
        },
        {
          name: 'Loratadine 10mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '15 days',
          instructions: 'With or without food',
          remaining: 0
        }
      ]
    },
    {
      id: 4,
      doctor: 'Dr. Amit Patel',
      date: '2024-08-28',
      status: 'Active',
      medications: [
        {
          name: 'Ibuprofen 400mg',
          dosage: '1 tablet',
          frequency: 'Three times daily',
          duration: '7 days',
          instructions: 'After meals only',
          remaining: 12
        },
        {
          name: 'Calcium + Vitamin D3',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'With breakfast',
          remaining: 18
        }
      ]
    },
    {
      id: 5,
      doctor: 'Dr. Kavita Singh',
      date: '2024-08-20',
      status: 'Completed',
      medications: [
        {
          name: 'Vitamin D3 1000 IU',
          dosage: '1 capsule',
          frequency: 'Once weekly',
          duration: '12 weeks',
          instructions: 'With milk or after meal',
          remaining: 0
        }
      ]
    }
  ];

app.get('/api/prescriptions/:abhaId', (req, res) => {
    // In a real application, you would fetch prescriptions based on the abhaId
    // For now, we'll just return the mock data
    res.json(prescriptions);
});

// Handle the menu selection
app.post('/ivr/handle-menu-selection', (req, res) => {
  const selection = req.body.Digits;
  const abhaId = req.query.abhaId;
  const language = req.query.language;
  const twiml = new twilio.twiml.VoiceResponse();

  // TODO: Fetch patient data based on abhaId

  if (selection === '1') {
    const latestPrescription = prescriptions[0];
    if (language === '1') {
        const medications = latestPrescription.medications.map(med => `${med.name}, ${med.dosage}, ${med.frequency} for ${med.duration}, instructions: ${med.instructions}`).join('. ');
        twiml.say({ language: 'en-IN' }, `Your latest prescription from ${latestPrescription.doctor} on ${latestPrescription.date} is: ${medications}.`);
    } else if (language === '2') {
        const medications = latestPrescription.medications.map(med => `${translateNumberToHindi(med.name)} ${med.dosage}, ${translateFrequency(med.frequency, 'hi-IN')}, ${translateInstruction(med.instructions, 'hi-IN')}, ${translateNumberToHindi(translateDuration(med.duration, 'hi-IN'))} के लिए`).join('. ');
        twiml.say({ language: 'hi-IN' }, `डॉक्टर ${latestPrescription.doctor} द्वारा ${latestPrescription.date} को दिया गया आपका नवीनतम डॉक्टर का पर्चा है: ${medications}।`);
    } else if (language === '3') {
        const medications = latestPrescription.medications.map(med => `${translateNumberToTelugu(med.name)} ${translateNumberToTelugu(med.dosage)}, ${translateFrequency(med.frequency, 'te-IN')}, ${translateInstruction(med.instructions, 'te-IN')}, ${translateNumberToTelugu(translateDuration(med.duration, 'te-IN'))} కోసం`).join('. ');
        twiml.say({ language: 'te-IN' }, `డాక్టర్ ${latestPrescription.doctor} ద్వారా ${latestPrescription.date} న ఇవ్వబడిన మీ తాజా ప్రిస్క్రిప్షన్: ${medications}।`);
    }
  } else if (selection === '2') {
    // TODO: Fetch and read the emergency medical information
    if (language === '1') {
        twiml.say({ language: 'en-IN' }, 'Your emergency medical information is: Patient has a severe allergy to peanuts. In case of accidental exposure, administer EpiPen immediately and call emergency services.');
    } else if (language === '2') {
        twiml.say({ language: 'hi-IN' }, 'आपकी emergency details है: रोगी को मूंगफली से गंभीर एलर्जी है। आकस्मिक संपर्क की स्थिति में, तुरंत EpiPen दें और आपातकालीन सेवाओं को कॉल करें।');
    } else if (language === '3') {
        twiml.say({ language: 'te-IN' }, 'మీ అత్యవసర వివరాలు: రోగికి వేరుశెనగతో తీవ్రమైన అలెర్జీ ఉంది. ప్రమాదవశాత్తు బహిర్గతం అయినప్పుడు, వెంటనే EpiPen ను వాడండి మరియు అత్యవసర సేవలకు కాల్ చేయండి。');
    }
  } else if (selection === '3') {
    if (language === '1') {
        twiml.say({ language: 'en-IN' }, 'Your latest lab report is for a blood test, and all values are within the normal range.');
    } else if (language === '2') {
        twiml.say({ language: 'hi-IN' }, 'आपकी नवीनतम लैब रिपोर्ट एक रक्त परीक्षण के लिए है, और सभी मान सामान्य सीमा के भीतर हैं।');
    } else if (language === '3') {
        twiml.say({ language: 'te-IN' }, 'మీ తాజా ల్యాబ్ నివేదిక రక్త పరీక్ష కోసం, మరియు అన్ని విలువలు సాధారణ పరిధిలో ఉన్నాయి。');
    }
  } else if (selection === '4') {
    if (language === '1') {
        twiml.say({ language: 'en-IN' }, 'You have no new family reports.');
    } else if (language === '2') {
        twiml.say({ language: 'hi-IN' }, 'आपके पास कोई नई पारिवारिक रिपोर्ट नहीं है।');
    } else if (language === '3') {
        twiml.say({ language: 'te-IN' }, 'మీకు కొత్త కుటుంబ నివేదికలు ఏవీ లేవు。');
    }
  } else if (selection === '5') {
    if (language === '1') {
        twiml.say({ language: 'en-IN' }, 'There are no new public health alerts in your area.');
    } else if (language === '2') {
        twiml.say({ language: 'hi-IN' }, 'आपके क्षेत्र में कोई नया सार्वजनिक स्वास्थ्य अलर्ट नहीं है।');
    } else if (language === '3') {
        twiml.say({ language: 'te-IN' }, 'మీ ప్రాంతంలో కొత్త ప్రజా ఆరోగ్య హెచ్చరికలు ఏవీ లేవు。');
    }
  } else {
    if (language === '1') {
        twiml.say({ language: 'en-US' }, 'Invalid selection.');
    } else if (language === '2') {
        twiml.say({ language: 'hi-IN' }, 'अमान्य चयन।');
    } else if (language === '3') {
        twiml.say({ language: 'te-IN' }, 'తప్పు ఎంపిక。');
    }
  }

  if (language === '1') {
    twiml.say({ language: 'en-IN' }, '<speak>Thank you for using <phoneme alphabet="ipa" ph="ɑːˈɾoːɡjəm">Aarogyam</phoneme>. Goodbye.</speak>');
  } else if (language === '2') {
    twiml.say({ language: 'hi-IN' }, 'आरोग्यम का उपयोग करने के लिए धन्यवाद। अलविदा।');
  } else if (language === '3') {
    twiml.say({ language: 'te-IN' }, 'ఆరోగ్యం ఉపయోగించినందుకు ధన్యవాదాలు. వీడ్కోలు。');
  }
  twiml.hangup();

  res.type('text/xml');
  res.send(twiml.toString());
});


// All other GET requests not handled before will return the React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

if (process.env.NODE_ENV !== 'production') {
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Access from other devices: http://YOUR_LOCAL_IP:${PORT}`);
      console.log('Make sure to replace YOUR_LOCAL_IP with your computer\'s local IP address');
    });
  }
  
  module.exports = app;}

module.exports = app;
