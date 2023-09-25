"use client";
import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify";
import { Input, message } from "antd";
import AdminApi from "@/lib/admin.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { auth, db } from "../../../Firebase/firebase.js";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import {
  notification
} from "antd";
import { InfinitySpin } from 'react-loader-spinner'

import * as Yup from 'yup';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import { Button, Modal, Space } from 'antd';

const Index = () => {
  const router = useRouter()

  const info = () => {
    Modal.info({
      content: 'Login first !',

      onOk() {
        router.push('/login')
      },
    });
  };


  const [loading, setLoading] = useState(false);




  const [searchText, setSearchText] = useState('');
  const countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo (Congo-Brazzaville)',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czechia (Czech Republic)',
    'Democratic Republic of the Congo (Congo-Kinshasa)',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'East Timor (Timor-Leste)',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Holy See',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Ivory Coast',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar (formerly Burma)',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'North Macedonia (formerly Macedonia)',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine State',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Tibet',
    'Timor-Leste (East Timor)',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States of America',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];

  const countryCodes = [
    { value: '+1', label: 'United States (+1)' },
    { value: '+44', label: 'United Kingdom (+44)' },
    { value: '+33', label: 'France (+33)' },
    { value: '+49', label: 'Germany (+49)' },
    { value: '+39', label: 'Italy (+39)' },
    { value: '+34', label: 'Spain (+34)' },
    { value: '+31', label: 'Netherlands (+31)' },
    { value: '+41', label: 'Switzerland (+41)' },
    { value: '+46', label: 'Sweden (+46)' },
    { value: '+47', label: 'Norway (+47)' },
    { value: '+91', label: 'India (+91)' },
    { value: '+92', label: 'Pakistan (+92)' },
    // Add more countries here
    { value: '+93', label: 'Afghanistan (+93)' },
    { value: '+355', label: 'Albania (+355)' },
    { value: '+213', label: 'Algeria (+213)' },
    { value: '+244', label: 'Angola (+244)' },
    { value: '+54', label: 'Argentina (+54)' },
    { value: '+374', label: 'Armenia (+374)' },
    { value: '+61', label: 'Australia (+61)' },
    { value: '+43', label: 'Austria (+43)' },
    { value: '+994', label: 'Azerbaijan (+994)' },
    { value: '+973', label: 'Bahrain (+973)' },
    { value: '+880', label: 'Bangladesh (+880)' },
    { value: '+375', label: 'Belarus (+375)' },
    { value: '+32', label: 'Belgium (+32)' },
    { value: '+501', label: 'Belize (+501)' },
    { value: '+229', label: 'Benin (+229)' },
    { value: '+975', label: 'Bhutan (+975)' },
    { value: '+591', label: 'Bolivia (+591)' },
    { value: '+387', label: 'Bosnia and Herzegovina (+387)' },
    { value: '+267', label: 'Botswana (+267)' },
    { value: '+55', label: 'Brazil (+55)' },
    { value: '+359', label: 'Bulgaria (+359)' },
    { value: '+226', label: 'Burkina Faso (+226)' },
    { value: '+257', label: 'Burundi (+257)' },
    { value: '+855', label: 'Cambodia (+855)' },
    { value: '+237', label: 'Cameroon (+237)' },
    { value: '+1', label: 'Canada (+1)' },
    { value: '+238', label: 'Cape Verde (+238)' },
    { value: '+236', label: 'Central African Republic (+236)' },
    { value: '+235', label: 'Chad (+235)' },
    { value: '+56', label: 'Chile (+56)' },
    { value: '+86', label: 'China (+86)' },
    { value: '+57', label: 'Colombia (+57)' },
    { value: '+269', label: 'Comoros (+269)' },
    { value: '+506', label: 'Costa Rica (+506)' },
    { value: '+385', label: 'Croatia (+385)' },
    { value: '+53', label: 'Cuba (+53)' },
    { value: '+357', label: 'Cyprus (+357)' },
    { value: '+420', label: 'Czech Republic (+420)' },
    { value: '+243', label: 'Democratic Republic of the Congo (+243)' },
    { value: '+45', label: 'Denmark (+45)' },
    { value: '+253', label: 'Djibouti (+253)' },
    { value: '+1', label: 'Dominican Republic (+1)' },
    { value: '+670', label: 'East Timor (+670)' },
    { value: '+593', label: 'Ecuador (+593)' },
    { value: '+20', label: 'Egypt (+20)' },
    { value: '+503', label: 'El Salvador (+503)' },
    { value: '+240', label: 'Equatorial Guinea (+240)' },
    { value: '+291', label: 'Eritrea (+291)' },
    { value: '+372', label: 'Estonia (+372)' },
    { value: '+251', label: 'Ethiopia (+251)' },
    { value: '+679', label: 'Fiji (+679)' },
    { value: '+358', label: 'Finland (+358)' },
    { value: '+33', label: 'France (+33)' },
    { value: '+241', label: 'Gabon (+241)' },
    { value: '+220', label: 'Gambia (+220)' },
    { value: '+995', label: 'Georgia (+995)' },
    { value: '+49', label: 'Germany (+49)' },
    { value: '+233', label: 'Ghana (+233)' },
    { value: '+30', label: 'Greece (+30)' },
    { value: '+502', label: 'Guatemala (+502)' },
    { value: '+224', label: 'Guinea (+224)' },
    { value: '+245', label: 'Guinea-Bissau (+245)' },
    { value: '+592', label: 'Guyana (+592)' },
    { value: '+509', label: 'Haiti (+509)' },
    { value: '+504', label: 'Honduras (+504)' },
    { value: '+852', label: 'Hong Kong (+852)' },
    { value: '+36', label: 'Hungary (+36)' },
    { value: '+354', label: 'Iceland (+354)' },
    { value: '+91', label: 'India (+91)' },
    { value: '+62', label: 'Indonesia (+62)' },
    { value: '+98', label: 'Iran (+98)' },
    { value: '+964', label: 'Iraq (+964)' },
    { value: '+353', label: 'Ireland (+353)' },
    { value: '+972', label: 'Israel (+972)' },
    { value: '+39', label: 'Italy (+39)' },
    { value: '+225', label: 'Ivory Coast (+225)' },
    { value: '+81', label: 'Japan (+81)' },
    { value: '+962', label: 'Jordan (+962)' },
    { value: '+7', label: 'Kazakhstan (+7)' },
    { value: '+254', label: 'Kenya (+254)' },
    { value: '+686', label: 'Kiribati (+686)' },
    { value: '+965', label: 'Kuwait (+965)' },
    { value: '+996', label: 'Kyrgyzstan (+996)' },
    { value: '+856', label: 'Laos (+856)' },
    { value: '+371', label: 'Latvia (+371)' },
    { value: '+961', label: 'Lebanon (+961)' },
    { value: '+266', label: 'Lesotho (+266)' },
    { value: '+231', label: 'Liberia (+231)' },
    { value: '+218', label: 'Libya (+218)' },
    { value: '+423', label: 'Liechtenstein (+423)' },
    { value: '+370', label: 'Lithuania (+370)' },
    { value: '+352', label: 'Luxembourg (+352)' },
    { value: '+853', label: 'Macau (+853)' },
    { value: '+389', label: 'Macedonia (+389)' },
    { value: '+261', label: 'Madagascar (+261)' },
    { value: '+265', label: 'Malawi (+265)' },
    { value: '+60', label: 'Malaysia (+60)' },
    { value: '+960', label: 'Maldives (+960)' },
    { value: '+223', label: 'Mali (+223)' },
    { value: '+356', label: 'Malta (+356)' },
    { value: '+692', label: 'Marshall Islands (+692)' },
    { value: '+222', label: 'Mauritania (+222)' },
    { value: '+230', label: 'Mauritius (+230)' },
    { value: '+262', label: 'Mayotte (+262)' },
    { value: '+52', label: 'Mexico (+52)' },
    { value: '+691', label: 'Micronesia (+691)' },
    { value: '+373', label: 'Moldova (+373)' },
    { value: '+377', label: 'Monaco (+377)' },
    { value: '+976', label: 'Mongolia (+976)' },
    { value: '+382', label: 'Montenegro (+382)' },
    { value: '+212', label: 'Morocco (+212)' },
    { value: '+258', label: 'Mozambique (+258)' },
    { value: '+95', label: 'Myanmar (+95)' },
    { value: '+264', label: 'Namibia (+264)' },
    { value: '+674', label: 'Nauru (+674)' },
    { value: '+977', label: 'Nepal (+977)' },
    { value: '+31', label: 'Netherlands (+31)' },
    { value: '+599', label: 'Netherlands Antilles (+599)' },
    { value: '+64', label: 'New Zealand (+64)' },
    { value: '+505', label: 'Nicaragua (+505)' },
    { value: '+227', label: 'Niger (+227)' },
    { value: '+234', label: 'Nigeria (+234)' },
    { value: '+850', label: 'North Korea (+850)' },
    { value: '+47', label: 'Norway (+47)' },
    { value: '+968', label: 'Oman (+968)' },
    { value: '+92', label: 'Pakistan (+92)' },
    { value: '+680', label: 'Palau (+680)' },
    { value: '+507', label: 'Panama (+507)' },
    { value: '+675', label: 'Papua New Guinea (+675)' },
    { value: '+595', label: 'Paraguay (+595)' },
    { value: '+51', label: 'Peru (+51)' },
    { value: '+63', label: 'Philippines (+63)' },
    { value: '+48', label: 'Poland (+48)' },
    { value: '+351', label: 'Portugal (+351)' },
    { value: '+974', label: 'Qatar (+974)' },
    { value: '+82', label: 'Republic of Korea (+82)' },
    { value: '+373', label: 'Republic of Moldova (+373)' },
    { value: '+40', label: 'Romania (+40)' },
    { value: '+7', label: 'Russia (+7)' },
    { value: '+250', label: 'Rwanda (+250)' },
    { value: '+590', label: 'Saint Martin (+590)' },
    { value: '+508', label: 'Saint Pierre and Miquelon (+508)' },
    { value: '+685', label: 'Samoa (+685)' },
    { value: '+378', label: 'San Marino (+378)' },
    { value: '+239', label: 'Sao Tome and Principe (+239)' },
    { value: '+966', label: 'Saudi Arabia (+966)' },
    { value: '+221', label: 'Senegal (+221)' },
    { value: '+381', label: 'Serbia (+381)' },
    { value: '+248', label: 'Seychelles (+248)' },
    { value: '+232', label: 'Sierra Leone (+232)' },
    { value: '+65', label: 'Singapore (+65)' },
    { value: '+1', label: 'Sint Maarten (+1)' },
    { value: '+421', label: 'Slovakia (+421)' },
    { value: '+386', label: 'Slovenia (+386)' },
    { value: '+677', label: 'Solomon Islands (+677)' },
    { value: '+252', label: 'Somalia (+252)' },
    { value: '+27', label: 'South Africa (+27)' },
    { value: '+211', label: 'South Sudan (+211)' },
    { value: '+34', label: 'Spain (+34)' },
    { value: '+94', label: 'Sri Lanka (+94)' },
    { value: '+249', label: 'Sudan (+249)' },
    { value: '+597', label: 'Suriname (+597)' },
    { value: '+268', label: 'Swaziland (+268)' },
    { value: '+46', label: 'Sweden (+46)' },
    { value: '+41', label: 'Switzerland (+41)' },
    { value: '+963', label: 'Syrian Arab Republic (+963)' },
    { value: '+886', label: 'Taiwan (+886)' },
    { value: '+992', label: 'Tajikistan (+992)' },
    { value: '+255', label: 'Tanzania (+255)' },
    { value: '+66', label: 'Thailand (+66)' },
    { value: '+228', label: 'Togo (+228)' },
    { value: '+690', label: 'Tokelau (+690)' },
    { value: '+676', label: 'Tonga (+676)' },
    { value: '+216', label: 'Tunisia (+216)' },
    { value: '+90', label: 'Turkey (+90)' },
    { value: '+993', label: 'Turkmenistan (+993)' },
    { value: '+688', label: 'Tuvalu (+688)' },
    { value: '+256', label: 'Uganda (+256)' },
    { value: '+380', label: 'Ukraine (+380)' },
    { value: '+971', label: 'United Arab Emirates (+971)' },
    { value: '+44', label: 'United Kingdom (+44)' },
    { value: '+1', label: 'United States (+1)' },
    { value: '+598', label: 'Uruguay (+598)' },
    { value: '+998', label: 'Uzbekistan (+998)' },
    { value: '+678', label: 'Vanuatu (+678)' },
    { value: '+379', label: 'Vatican City State (+379)' },
    { value: '+58', label: 'Venezuela (+58)' },
    { value: '+84', label: 'Vietnam (+84)' },
    { value: '+967', label: 'Yemen (+967)' },
    { value: '+260', label: 'Zambia (+260)' },
    { value: '+263', label: 'Zimbabwe (+263)' },
  ];
  const filteredCountryCodes = countryCodes.filter((country) =>
    country.label.toLowerCase().includes(searchText.toLowerCase())
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [fullNumber, setFullNumber] = useState('');

  const handleCountryCodeChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountryCode(countryCode);
    // setFullNumber(countryCode);
    setFormData({
      ...formData, // Spread the existing values
      phone: countryCode, // Update only the phone value
    });
  };

  const handleSelectChange = (e) => {

    setSearchText(e.target.value);
    const filtered = countries.filter((country) =>
      country.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCountries(filtered);
    setFormData({
      ...formData, // Spread the existing values
      country: e.target.value, // Update only the phone value
    });

  };

  const [filteredCountries, setFilteredCountries] = useState(countries);



  const [selectedCountry, setSelectedCountry] = useState('');


  // Find the country object with the matching code
  const selectedCountries = countryCodes.filter((country) =>

    country.value.toLowerCase().includes(selectedCountryCode.toLowerCase())

  )

  useEffect(() => {
    const countryName = selectedCountries[0].label?.match(/^(.*?)\s+\(\+\d+\)$/);

    if (countryName && countryName.length >= 2) {
      const extractedCountryName = countryName[1];
      setSelectedCountry(extractedCountryName)
      console.log(extractedCountryName); // This will print "Honduras"
    } else {
      console.log("Country name not found in the input string");
    }
  })



  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();
  const updateMutation = useMutation(
    ["Admins"],
    async ({ id, admin }) => {
      console.log("MUTATION", admin)
      await AdminApi.updateAdmin(id, admin);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: "Profile been updated successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Admins"]);
        onCancel();

      },
    }
  );
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  let userId
  let user
  try {
    user = auth.currentUser;
    userId = user.uid
  } catch (error) {
    console.log(error)
  }



  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        info()

      }
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);




  const admin = {
    name: "James William",
    first: "James",
    last: "Williams",
    email: "james@email.com",
    phone: "+91 65765767 6",
    country: "USA",
    city: "New York",
    postal: "5676877",
    address: "333 St Paun, New York , USA",
    password: "abcd123"
  };

  const { data, isLoading, isError } = useQuery(
    ['Admins', userId],
    async () => {

      const response = await AdminApi.getUserByUserId(userId);
      return response;// Assuming your API returns data property

    }
  );
  console.log(data)
  const [formData, setFormData] = useState({
    firstName: data && userId && data.firstName,
    lastName: data && userId && data.lastName,
    email: data && userId && data.email,
    phone: data && userId && data.phone,
    country: data && userId && data.country,
    register: data && userId && data.register,
    address: data && userId && data.address,
    city: data && userId && data.city,

  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .test('not-email', 'First Name cannot be an email', value => {
        // Check if the value does not look like an email address
        return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      })
      .test('not-number', 'First Name cannot be a number', value => {
        // Check if the value is not a number
        return isNaN(Number(value));
      }),
    lastName: Yup.string()
      .required('Last Name is required')
      .test('not-email', 'Last Name cannot be an email', value => {
        // Check if the value does not look like an email address
        return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      })
      .test('not-number', 'Last Name cannot be a number', value => {
        // Check if the value is not a number
        return isNaN(Number(value));
      }),
    email: Yup.string().email('Invalid email').required('Email is required'),

    phone: Yup.string()
      .test('valid-phone', 'Invalid phone number', (value) => {
        if (!value) return false; // Phone is required and cannot be empty

        // Check if the value consists of a plus sign followed by numbers
        if (!/^\+\d+$/.test(value)) {
          return false;
        }
        if (value.length < 8 || value.length > 14) {
          return false;
        }

        return true; // Phone number is valid (contains a plus sign followed by numbers)
      })
      .required('Phone is required'),

    country: Yup.string().required('Please select a country').test('not-select-category', 'Please select a Valid Country', value => {
      return value !== 'Select Country';
    }),

  });

  // console.log("FORM", formData)

  const [isFormEdited, setIsFormEdited] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsFormEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await validationSchema.validate(formData, { abortEarly: false });



      console.log('Form data is valid:', formData);
      // setLoading(true);



      const values = {
        firstName: formData.firstName,
        email: formData.email,
        lastName: formData.lastName,
        country: selectedCountry,
        phone: formData.phone,
        city: formData.city,
      };


      updateMutation.mutate({ id: userId, admin: values })
      setErrors({})



      setLoading(false);



    } catch (error) {

      if (error instanceof Yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        setLoading(false);
        console.log(error)
        // console.log('Form data is valid');


      }
      else {
        const message = error.message
        var modifiedText = message.replace("Firebase:", '');
        setErrors("");
        console.log(error)
        notification.open({
          type: "error",
          message: modifiedText,
          placement: "top",
        });
        // console.log('Form data is valid');

        console.log("FIREBASE ERROR", error)


        setLoading(false);
      }





    }



  };

  const logOut = async () => {
    try {
      await auth.signOut();
      notification.open({
        type: "success",
        message: "Signed out!",
        placement: "top",
      });
      router.push('/login');


    } catch (error) {
      // An error happened during sign-out.
      console.error(error);
    }

  }



  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "repeatPassword") {
      setRepeatPassword(value);
    }
  };

  useEffect(() => {
    if (newPassword === repeatPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }, [newPassword, repeatPassword]);

  const [userEmail, setUserEmail] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in.
        setUserEmail(authUser);
        console.log("User's email:", authUser.email);
      } else {
        // User is signed out.
        setUserEmail(null);
        console.log("User is signed out.");
      }
    });

    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  console.log("LOGED IN USER email", userEmail?.email)

  const handlePasswordSubmit = (e) => {

    e.preventDefault();
    console.log("LOGED IN USER", userId)
    setLoading(true);

    if (newPassword === repeatPassword) {

      if ((newPassword !== "" || repeatPassword !== "")) {
        const credential = EmailAuthProvider.credential(userEmail?.email, currentPassword);
        console.log("USER", credential)
        // Reauthenticate the user
        reauthenticateWithCredential(user, credential)
          .then(() => {
            // Reauthentication successful, update the password
            updatePassword(user, newPassword)
              .then(() => {
                notification.open({
                  type: "success",
                  message: "Password updated successfully",
                  placement: "top",
                });
                setCurrentPassword('');
                setNewPassword('');
                setPasswordMatch('')
                setRepeatPassword('');
                setLoading(false);

              })
              .catch((error) => {
                console.log("Error updating password: " + error.message);
              });
          })
          .catch((error) => {
            if (error.message === "Firebase: Error (auth/wrong-password).") {
              notification.open({
                type: "error",
                message: "Wrong current password",
                placement: "top",
              });
              setLoading(false);

            }
            if (error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
              notification.open({
                type: "error",
                message: "Too many attempts wrong try later! ",
                placement: "top",
              });
              setLoading(false);

            }
            console.log("Error reauthenticating: " + error.message); setLoading(false);

          });

      }
      else {
        message.error("Please enter password to update"); setLoading(false);

        return;
      }

    } else {

      message.error("Passwords do not match. Please try again.");
      setLoading(false);

    }
    setLoading(false);

  };

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (isError) {
    return <h1>Error</h1>
  }



  return (
    <div className="w-full bg-[F9F9F9]">
      <Head>
        <title>Profile</title>
      </Head>
      <div className="h-full w-full  my-4 overflow-hidden">
        <div className="w-full h-full flex md:flex-row flex-col items-start md:justify-start my-5 md:px-6 px-4 md:px-0 ">
          <div className=" w-full md:w-[50%] xl:md-[50%] flex md:flex-col flex-wrap  ">
            <div className="flex flex-col flex-grow  bg-[#FFFFFF] shadow-sm rounded-md px-5 py-5  md:w-full">
              <h2 className="font-[500] text-[18px]">My Profile</h2>
              <div className="mb-3 mt-5 flex items-center">
                {/* <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image src="/images/admin.svg" width={64} height={64} alt="Admin Image" />
                </div> */}
                <div>
                  <p className="text-[18px] font-normal text-[#000000]">{data?.firstName} {data?.lastName} </p>
                  <p className="text-[16px] font-normal text-[#777777]">Admin</p>
                </div>
              </div>
              <div className="my-3">
                <div className="flex items-start my-4 pb-3 border-b border-[#DFDFDF]">
                  <p className="text-[15px] font-[400] text-[#777777] uppercase">Full Name:</p>
                  <p className="ml-2 text-[16px] font-normal">{data?.firstName} {data?.lastName}</p>
                </div>
                <div className="flex items-start my-4 pb-3 border-b border-[#DFDFDF]">
                  <p className="text-[15px] font-[400] text-[#777777] uppercase">Mobile:</p>
                  <p className="ml-2 text-[16px] font-normal">{data?.phone}</p>
                </div>
                <div className="flex items-start my-4 pb-3 border-b border-[#DFDFDF]">
                  <p className="text-[15px] font-[400] text-[#777777] uppercase">Email:</p>
                  <p className="ml-2 text-[16px] font-normal">{data?.email}</p>
                </div>
                <div className="flex items-start my-4 pb-3 border-b border-[#DFDFDF]">
                  <p className="text-[15px] font-[400] text-[#777777] uppercase">Location:</p>
                  <p className="ml-2 text-[16px] font-normal">{data?.address}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:flex-row flex flex-col   my-5 md:my-0 sm:mx-4 gap-4">
            <div className="w-full  bg-[#FFFFFF] shadow-sm rounded-md py-5">
              <div className="px-6">
                <h2 className="font-[500] text-[18px]">Edit Profile</h2>
              </div>

              <form className="my-3 border-b border-[#DFDFDF] px-6 pb-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Select Country Code
                    </label>
                    <select
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"

                      id="country-code"
                      onChange={handleCountryCodeChange}
                      value={selectedCountryCode}
                    >
                      <option value="">Select a country code</option>
                      {filteredCountryCodes.map((country, index) => (
                        <option key={index} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full mb-4 block">
                    <label htmlFor="full-number" className="text-[16px] font-normal text-[#777777]"
                    >Enter Full Number:</label>
                    <input
                      placeholder='Phone Number'
                      type="text"
                      id="phone"
                      name='phone'
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"

                      value={formData.phone}
                      readOnly={!selectedCountryCode}
                      onChange={handleChange}

                    />
                    {errors.phone && <div className="  px-1 justify-start text-[red] max-w-[100px] w-full flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.phone}</div>}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                    {errors.email && <div className="  px-1 justify-start text-[red] max-w-[100px] w-full flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.email}</div>}
                  </div>

                  {/* <div>
                    <label
                      htmlFor="country"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Country
                    </label>
                    <select name='country'
                      id='country'
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"

                      value={searchText !== '' ? searchText : formData.country}
                      onChange={handleSelectChange}
                    >
                      <option value="">Select a country</option>
                      {filteredCountries.map((country, index) => (
                        <option key={index} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.country}</div>}
                  </div> */}
                  <div>
                    <label
                      htmlFor="city"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                  </div>
                  {/* <div className="w-full">
                    <label
                      htmlFor="register"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Register As
                    </label>
                    <input
                      type="text"
                      id="register"
                      name="register"
                      value={formData.register}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    />
                  </div> */}
                </div>
                {/* <div className="mt-4">
                  <label
                    htmlFor="about"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    About Me
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    placeholder="Write here..."
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    rows={4}
                    style={{ resize: "none" }}
                  />
                </div> */}
                <div className="w-full flex justify-center sm:justify-end ">
                  {
                    loading ? <InfinitySpin
                      visible={true}
                      width="200"
                      ariaLabel="InfinitySpin -loading"
                      wrapperStyle={{}}
                      wrapperClass="InfinitySpin -wrapper"
                      color="#A51F6C"

                      // colors={['#F4442E', '#F4442E', '#F4442E', '#F4442E', '#F4442E']}
                      backgroundColor="#F4442E"
                    /> : <button
                      type="submit"
                      className="mt-6 bg-[#A51F6C] text-white py-2 px-4 rounded transition duration-300 hover:bg-[#E82494]"
                    >
                      Update Profile
                    </button>

                  }

                </div>

              </form>
              <form className="my-3  px-6 pb-6" onSubmit={handlePasswordSubmit}>
                <div className="">
                  <h2 className="font-[500] text-[18px]">Change Password</h2>
                </div>
                <div className="mt-3">
                  <div className="flex flex-col lg:flex-row items-start gap-x-4 mt-4 pb-3 w-full">
                    <div className="sm:w-[50%] w-full">
                      <label className="text-[16px] font-normal text-[#777777]">
                        Current Password:
                      </label>
                      <Input.Password
                        type="password"
                        id="currentPassword"
                        onChange={(e) => { setCurrentPassword(e.target.value) }}
                        value={currentPassword}
                        name="currentPassword"
                        placeholder="Enter Current password"
                        className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                      />
                    </div>

                    <div className="sm:w-[50%] w-full lg:ml-4">
                      <label className="text-[16px] font-normal text-[#777777]">
                        New Password:
                      </label>
                      <Input.Password
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        className="w-full py-2 fontFamily px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                        placeholder="New Password"
                      />
                    </div>


                    <div className="md:w-[50%] w-full">
                      <label className="text-[16px] font-normal text-[#777777]">
                        Repeat Password:
                      </label>
                      <Input.Password
                        id="repeatPassword"
                        name="repeatPassword"
                        value={repeatPassword}
                        onChange={handlePasswordChange}
                        className={`w-full py-2 px-3 border fontFamily ${passwordMatch
                          ? "border-[#2668E81A]"
                          : "border-[#FF0000]"
                          } rounded transition duration-300 bg-[#2668E803] focus:outline-none ${passwordMatch
                            ? "focus:border-[#2668E855] hover:border-[#2668E855]"
                            : "focus:border-[#FF0000] hover:border-[#FF0000]"
                          }`}
                        placeholder="Repeat Password"
                      />
                      {!passwordMatch && (
                        <p className="text-red-600 mt-2">
                          Passwords do not match. Please try again.
                        </p>
                      )}
                    </div>

                  </div>


                  <div className="w-full flex justify-center sm:justify-end">
                    {
                      loading ? <InfinitySpin
                        visible={true}
                        width="200"
                        ariaLabel="InfinitySpin -loading"
                        wrapperStyle={{}}
                        wrapperClass="InfinitySpin -wrapper"
                        color="#A51F6C"

                        // colors={['#F4442E', '#F4442E', '#F4442E', '#F4442E', '#F4442E']}
                        backgroundColor="#F4442E"
                      /> : <button
                        type="submit"
                        className=" bg-[#A51F6C] text-white py-2 px-4 rounded transition duration-300 hover:bg-[#E82494]"
                      >
                        Change Password
                      </button>
                    }

                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Index;
