import React from "react";
import TestList from "./TestList";

const PastTests = ({ tests }) => {
  const handleClick = (test) => {
    const now = new Date();
    const testStartTime = new Date(testStartTime.getTime() + 30 * 60000);
    // const thirtyMinutesLater = new Date(testStartTime.getTime() + 30 * 60000);

    if (now > testStartTime) {
      alert("The test is completed.");
    } else {
      console.log("The test is still accessible.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Past Tests</h2>
      {tests.length === 0 ? (
        <p>No Tests Available right now.</p>
      ) : (
        <TestList tests={tests} onClick={handleClick} />
      )}
    </div>
  );
};

export default PastTests;
