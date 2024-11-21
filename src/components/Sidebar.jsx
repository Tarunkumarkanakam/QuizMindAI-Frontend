import React from 'react';

const Sidebar = ({
  examData,
  currentSection,
  currentQuestionIndex,
  handleSectionClick,
  handleQuestionClick,
  openDropdown,
  setOpenDropdown,
  getQuestionStatusClass,
}) => {
  return (
    <div className="w-full md:w-1/4 pr-4 mb-4 md:mb-0">
      <div className="bg-white shadow-md rounded-lg p-4">
        <ul className="list-none">
          {Object.keys(examData).map((sectionName) => (
            <li key={sectionName}>
              {/* Section Header */}
              <div
                className={`cursor-pointer p-2 mb-2 rounded-md transition-colors duration-200 ${
                  sectionName === currentSection
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
                }`}
                onClick={() => handleSectionClick(sectionName)}
              >
                {sectionName}
              </div>
              {/* Question Numbers */}
              {openDropdown === sectionName && (
                <div className="mt-2 ml-2 grid grid-cols-5 gap-2">
                  {examData[sectionName].map((_, questionIndex) => (
                    <div
                      key={questionIndex}
                      className={`cursor-pointer p-2 rounded-md transition-colors duration-200 flex items-center justify-center ${
                        getQuestionStatusClass(sectionName, questionIndex)
                      }`}
                      onClick={() =>
                        handleQuestionClick(sectionName, questionIndex)
                      }
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium">
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
