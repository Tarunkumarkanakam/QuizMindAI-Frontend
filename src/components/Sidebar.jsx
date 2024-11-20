import React from 'react';

const Sidebar = ({ examData, currentSection, currentQuestionIndex, handleSectionClick, handleQuestionClick, openDropdown, setOpenDropdown, getQuestionStatusClass }) => {
  return (
    <div className="w-full md:w-1/4 pr-4 mb-4 mr-20 md:mb-0">
      <div className="bg-white shadow-md rounded-lg p-4">
        <ul className="list-none">
          {Object.keys(examData).map((sectionName) => (
            <li key={sectionName}>
              <div
                className={`cursor-pointer p-2 mb-2 rounded transition-colors duration-200 ${
                  sectionName === currentSection
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-gray-100 hover:bg-blue-100'
                }`}
                onClick={() => handleSectionClick(sectionName)}
              >
                {sectionName}
              </div>
              {openDropdown === sectionName && (
                <div className="mt-2 ml-4 bg-gray-50 p-2 rounded shadow-inner grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))] gap-2">
                  {examData[sectionName].map((_, questionIndex) => (
                    <div
                      key={questionIndex}
                      className={`cursor-pointer p-2 rounded transition-colors duration-200 ${getQuestionStatusClass(
                        sectionName,
                        questionIndex
                      )} ${currentSection === sectionName && currentQuestionIndex === questionIndex ? 'animate-bounce bg-yellow-300' : ''}`}
                      onClick={() =>
                        handleQuestionClick(sectionName, questionIndex)
                      }
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-white-300 rounded-full ">
                        {questionIndex + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
