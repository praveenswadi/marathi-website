import React from 'react'
import VersePage from './components/VersePage'
import './App.css'

const sampleData = {
  title: "अथर्वशीर्ष",
  verses: [
    {
      id: 1,
      sanskrit: "श्री गणेशाय नमः ॥",
      marathi: "श्रीगणेशाला माझा नमस्कार असो.",
      explanation: "",
      color: "purple"
    },
    {
      id: 2,
      sanskrit: "ॐ भद्रं कर्णेभिः शृणुयाम देवाः ॥",
      marathi: "हे देवांनो, आम्ही कानांनी (कर्णेभिः) मंगल (भद्र) ऐकावे (शृणुयाम् ).",
      explanation: "",
      color: "purple"
    },
    {
      id: 3,
      sanskrit: "भद्रम् पश्येमाक्षभिर्यजत्राः ॥",
      marathi: "ईश्वरोपासना करणाऱ्या (यजत्राः) आम्हीं डोळ्यांनी (अक्षभिः) कल्याणकारक (भद्र) गोष्टी पराव्यात (पश्येम्).",
      explanation: "[ पश्ये म् + अक्षभिः + यजत्राः]",
      color: "purple"
    },
    {
      id: 4,
      sanskrit: "स्थिरै रंगै स्तुष्टुवांसस्तनूभिः व्यशेम् देवहितं यदायुः ॥",
      marathi: "सशक्त अवयवांनी व सुदृढ शरीराने युक्त असे हे देवांनी दिलेले आयुष्य (यत् + आयुः) तुमची स्तुती (देवहितं) करीत घालवावे (व्यशेम्).",
      explanation: "[ स्थिरैः + अंगैः + तुष्टुवांसः + तनूभिः]",
      color: "purple"
    },
    {
      id: 5,
      sanskrit: "ॐ स्वस्ति नः इंद्रो वृद्धश्रवाः ॥",
      marathi: "अतिशय कीर्तिमान (वृद्धश्रवाः) असा इंद्र आमचे (नः) कल्याण करो. (स्वस्ति).",
      explanation: "",
      color: "purple"
    },
    {
      id: 6,
      sanskrit: "स्वस्ति नः पूषा विश्वदेवाः । स्वस्ति नस्तार्थ्यो अरिष्टनेभिः ॥",
      marathi: "अतिशय ज्ञानवान (विश्वदेवाः) असा सूर्य (पूषाः) आमचे कल्याण करो. गति कुंठित न होणारा (अरिष्टनेभिः), गरुड (तार्थ्यों) आमचे कल्याण करो.",
      explanation: "[नस्तार्थ्यो = नः + ताक्ष्यों ] नः = आमचे",
      color: "purple"
    }
  ]
}

function App() {
  return (
    <div className="App">
      <VersePage data={sampleData} />
    </div>
  )
}

export default App

