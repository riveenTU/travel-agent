import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './App.css';
import NavigationBar from './NavigationBarComponent/NavigationBar';
import Content from './IndexContent/Content';
import Footer from './FooterComponent/Footer';
import Tour from './TourComponent/Tour';
import ToursCollection from './ToursCollection/ToursCollection';


const mostPopularItems = [
  {
    image: "./images/image5.png",
    heading: "Blink",
    content: "3 nights/ 4 days",
    link: "/tour"
  },
  {
    image: "./images/image6.png",
    heading: "Cultural Splendour",
    content: "4 nights/ 5 days",
    link: "/tour"
  },
  {
    image: "./images/image7.png",
    heading: "Pixie",
    content: "4 nights/ 5 days",
    link: "#"
  },
  {
    image: "./images/image9.png",
    heading: "Glorious Sri Lanka",
    content: "4 nights/ 5 days"
  },
  // {
  //   image: "./images/image7.png",
  //   heading: "Pixie",
  //   content: "4 nights/ 5 days"
  // },
  // {
  //   image: "./images/image5.png",
  //   heading: "Blink",
  //   content: "3 nights/ 4 days"
  // }
  // {
  //   image: "./images/image5.png",
  //   heading: "Blink",
  //   content: "3 nights/ 4 days"
  // },
  // {
  //   image: "./images/image5.png",
  //   heading: "Blink",
  //   content: "3 nights/ 4 days"
  // }
]

const comments = [
  {
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia libero ut euismod luctus. Aliquam tincidunt ultrices lacus, vel aliquet orci facilisis dignissim.",
    image: "./images/image10.png",
    name: "Beverly, Illinois",
    index: "1"
  },
  {
    comment: "gfhfghfh Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia libero ut euismod luctus. Aliquam tincidunt ultrices lacus, vel aliquet orci facilisis dignissim.",
    image: "./images/image10.png",
    name: "Illsa Faust",
    index: "2"
  },
  {
    comment: "ilujilul Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia libero ut euismod luctus. Aliquam tincidunt ultrices lacus, vel aliquet orci facilisis dignissim.",
    image: "./images/image10.png",
    name: "Julliete Nicoles",
    index: "3"
  }
]

const tourDetails = {
  tourName: "Blink",
  image1: "./images/image13.png",
  highlights: ["Lorem ipsum dolor", "Lorem ipsum dolor", "Lorem ipsum dolor"],
  whatToBring: ["Lorem ipsum dolor", "Lorem ipsum dolor", "Lorem ipsum dolor"],
  suitableFor: "12 to 50 year olds",
  includes: ["Lorem ipsum dolor sit amet", "Lorem ipsum dolor sit amet", "Lorem ipsum dolor sit amet", "Lorem ipsum dolor sit amet", "Lorem ipsum dolor"],

  activities: [
    {
      day: 1,
      city: "Kandy",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia libero ut euismod luctus. Aliquam tincidunt ultrices lacus, vel aliquet orci facilisis dignissim. Suspendisse pretium pharetra neque non tincidunt. Mauris scelerisque dolor id felis volutpat scelerisque. Quisque ullamcorper condimentum leo, eget auctor justo hendrerit ut. ",
      image2: "./images/image14.png"
    },
    {
      day: 2,
      city: "Trincomalee",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      image2: "./images/image14.png"
    },
    {
      day: 3,
      city: "Colombo",
      description: "Id leo in vitae turpis massa sed elementum tempus egestas. Aliquam id diam maecenas ultricies mi eget mauris. Proin fermentum leo vel orci porta non. Sodales ut eu sem integer vitae justo. Tellus at urna condimentum mattis pellentesque id nibh tortor. Ultrices tincidunt arcu non sodales. Gravida quis blandit turpis cursus in hac. Diam in arcu cursus euismod quis.",
      image2: "./images/image14.png"
    },
    {
      day: 4,
      city: "Jaffna",
      description: "Eu consequat ac felis donec et odio pellentesque diam volutpat. At urna condimentum mattis pellentesque id nibh. Condimentum vitae sapien pellentesque habitant morbi tristique senectus. Consectetur purus ut faucibus pulvinar elementum integer enim neque. Neque egestas congue quisque egestas diam. Commodo elit at imperdiet dui accumsan sit amet nulla.",
      image2: "./images/image14.png"
    }
  ]
}

function App() {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <NavigationBar/> */}
        <Routes>
          <Route path='/' element={
              <Content
                mostPopularItems={mostPopularItems}
                comments={comments}
              />
          }/>
          <Route path='/tour' element={<Tour tourDetails={tourDetails}/>}/>
          <Route path='/tour/:id' element={<Tour tourDetails={tourDetails}/>}/>
          <Route path='/packages' element={
            <ToursCollection mostPopularItems={mostPopularItems}/>
          }/>
        </Routes>
        <Footer/>
      </LocalizationProvider>
      
    </div>
  );
}

export default App;
