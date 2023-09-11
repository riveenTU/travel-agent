//import logo from './logo.svg';
import './App.css';
import MostPopular from './MostPopularComponent/MostPopular.jsx'

const mostPopularItems = [
  {
    image: "./images/image5.png",
    heading: "Blink",
    content: "3 nights/ 4 days",
    link: "#"
  },
  {
    image: "./images/image6.png",
    heading: "Cultural Splendour",
    content: "4 nights/ 5 days",
    link: "#"
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
  {
    image: "./images/image7.png",
    heading: "Pixie",
    content: "4 nights/ 5 days"
  },
  {
    image: "./images/image5.png",
    heading: "Blink",
    content: "3 nights/ 4 days"
  },
  {
    image: "./images/image5.png",
    heading: "Blink",
    content: "3 nights/ 4 days"
  },
  {
    image: "./images/image5.png",
    heading: "Blink",
    content: "3 nights/ 4 days"
  }
]

function App() {
  return (
    mostPopularItems.map((item, index)=>(
      <MostPopular 
        key={index}
        id={index}
        image={item.image}
        heading={item.heading}
        content={item.content}
        link={item.link}
      />
    ))
  );
}

export default App;
