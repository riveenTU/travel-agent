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
    image: "/images/image13.png",
    heading: "Blink",
    content: "3 nights/ 4 days",
    link: "/tour/69b22c9c8134df190aed7e3c"
  },
  {
    image: "/images/sigiriya_rock.jpg",
    heading: "Sigiriya Explorer",
    content: "2 nights/ 3 days",
    link: "/tour/69b22c9c8134df190aed7e38"
  },
  {
    image: "/images/image7.png",
    heading: "Pixie",
    content: "4 nights/ 5 days",
    link: "#"
  },
  {
    image: "/images/image9.png",
    heading: "Glorious Sri Lanka",
    content: "4 nights/ 5 days"
  }
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
          } />
          <Route path='/tour' element={<Tour />} />
          <Route path='/tour/:id' element={<Tour />} />
          <Route path='/packages' element={
            <ToursCollection mostPopularItems={mostPopularItems} />
          } />
        </Routes>
        <Footer />
      </LocalizationProvider>

    </div>
  );
}

export default App;
