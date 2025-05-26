import user1 from "../assets/images/user1.jpeg";
import user2 from "../assets/images/user2.jpg";
import user3 from "../assets/images/user3.avif";
import yt from "../assets/images/yt.png";
import google from "../assets/images/google.png";
import insta from "../assets/images/insta.png";
import meta from "../assets/images/meta.png";
import ms from "../assets/images/ms.png";
import binance from "../assets/images/bina.png";
import type { CompanyProps } from "@/components/Company";

export const topEarners = [
  {
    name: "John Doe",
    amount: 12897,
    profile: user1,
  },
  {
    name: "Jane Doe",
    amount: 86939,
    profile: user2,
  },
  {
    name: "Sylus Abel",
    amount: 56987,
    profile: user3,
  },
];

export const topBounties = [
  {
    name: "YouTube",
    amount: 248904,
    profile: yt,
  },
  {
    name: "Google",
    amount: 216987,
    profile: google,
  },
  {
    name: "Instagram",
    amount: 199745,
    profile: insta,
  },
  {
    name: "Meta",
    amount: 184236,
    profile: meta,
  },
  {
    name: "Microsoft",
    amount: 166710,
    profile: ms,
  },
];

export const topCompanies: CompanyProps[] = [
  {
    id: "1",
    name: "Company1",
    phone_number: "1234567890",
    email: "company1@gmail.com",
    logo: yt,
    description: "Company1 Description",
    website: "https://company1.com",
    address: "1234567890",
    manager: {
      id: "1",
      name: "Manager1",
      email: "manager1@gmail.com",
    },
  },
  {
    id: "2",
    name: "Company2",
    phone_number: "1234567890",
    email: "company2@gmail.com",
    logo: google,
    description: "Company2 Description",
    website: "https://company2.com",
    address: "1234567890",
    manager: {
      id: "2",
      name: "Manager2",
      email: "manager2@gmail.com",
    },
  },
  {
    id: "3",
    name: "Company3",
    phone_number: "1234567890",
    email: "company3@gmail.com",
    logo: insta,
    description: "Company3 Description",
    website: "https://company3.com",
    address: "1234567890",
    manager: {
      id: "3",
      name: "Manager3",
      email: "manager3@gmail.com",
    },
  },
  {
    id: "4",
    name: "Company4",
    phone_number: "1234567890",
    email: "company4@gmail.com",
    logo: meta,
    description: "Company4 Description",
    website: "https://company4.com",
    address: "1234567890",
    manager: {
      id: "4",
      name: "Manager4",
      email: "manager4@gmail.com",
    },
  },
  {
    id: "5",
    name: "Company5",
    phone_number: "1234567890",
    email: "company5@gmail.com",
    logo: ms,
    description: "Company5 Description",
    website: "https://company5.com",
    address: "1234567890",
    manager: {
      id: "5",
      name: "Manager5",
      email: "manager5@gmail.com",
    },
  },
  {
    id: "6",
    name: "Company6",
    phone_number: "1234567890",
    email: "company6@gmail.com",
    logo: binance,
    description: "Company6 Description",
    website: "https://company6.com",
    address: "1234567890",
    manager: {
      id: "6",
      name: "Manager6",
      email: "manager6@gmail.com",
    },
  },
];

export const mySubmissions = [
  {
    name: "YouTube",
    amount: 184,
    paid: true,
    date: "2025-05-23",
    profile: yt,
  },
  {
    name: "Google",
    amount: 184,
    paid: false,
    date: "2025-05-23",
    profile: google,
  },
  {
    name: "Meta",
    amount: 184,
    paid: true,
    date: "2025-05-23",
    profile: meta,
  },
];
