// voice.js
let recognition;

// Function to handle the voice commands
function handleVoiceCommand(command) {
  if (command.includes("text editor")) {
    if (codeEditor) {
      speakText("Text Editor is already open.");
    } else {
      createNewFile();
      speakText("Opening Text Editor");
    }
  } else if (command.includes("file explorer")) {
    if (fileManager) {
      speakText("File Manager is already open");
    } else {
      openFile();
      speakText("Opening File Explorer.");
    }
  } else if (command.includes("camera")) {
    if (camera) {
      speakText("Camera is already open");
    } else {
      openCamera();
      speakText("Opening Camera.");
    }
  } else if (command.includes("new file")) {
    if (codeEditor) {
      createNewFile();
      speakText("Creating a new file.");
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("open file")) {
    if (codeEditor) {
      openFile();
      speakText("Opening a file.");
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("save file")) {
    if (codeEditor) {
      if (isFileSaved) {
        speakText("Please make some changes before saving");
      } else {
        saveFile();
        speakText("Saving the file.");
      }
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("save the file as")) {
    //save as {dili niya mapick up ang save as, save as file, save file as, save as new file}
    if (codeEditor) {
      saveFileAs();
      speakText("Saving as a new file");
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("undo")) {
    if (codeEditor) {
      if (currentHistoryIndex <= 0) {
        speakText("Cannot undo");
      } else {
        undo();
        speakText("Undo done");
      }
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("redo")) {
    if (codeEditor) {
      if (currentHistoryIndex >= editorHistory.length - 1) {
        speakText("Cannot redo");
      } else {
        redo();
        speakText("Redo done");
      }
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("microphone")) {
    if (codeEditor) {
      speakText("Speech to text enabled.");
      setTimeout(enableSpeechToText, 2000); // Delay execution by 3 seconds
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("minimize")) {
    if (codeEditor) {
      if (minimized) {
        speakText("Text Editor is minimized");
      } else {
        minimizeEditor();
        speakText("Minimizing Text Editor");
      }
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("resize")) {
    if (codeEditor) {
      if (minimized) {
        speakText("Text Editor is minimized");
      } else {
        max();
        speakText("Resizing Text Editor");
      }
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("close file")) {
    if (codeEditor) {
      closeFile();
      speakText("Closing Text Editor");
    } else {
      speakText("Open Text Editor first.");
    }
  } else if (command.includes("change mode")) {
    toggleMode();
    speakText("Changing the mode");
  } else if (command.includes("shut down")) {
    if (codeEditor || camera) {
      speakText("Some tabs are open. Close them first");
    } else {
      // speakText("Goodbye honey.");
      setTimeout(function () {
        shutdown();
      }, 2000);
    }
  }
}

// Function to start voice recognition
function startVoiceRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false; // Set continuous to false

  // Set a longer timeout duration (e.g., 15 seconds)
  recognition.timeout = 15000;

  recognition.onstart = function () {
    console.log("Voice recognition started.");
    displayMessage(
      'Listening... Say "Hey Honey" followed by a command and end with "please".'
    );
    playSound("sfx/start-sound.mp3");
  };

  recognition.onresult = function (event) {
    const command = event.results[event.results.length - 1][0].transcript;
    if (command.toLowerCase().includes("hey honey")) {
      const extractedCommand = command
        .toLowerCase()
        .replace("hey honey", "")
        .trim();

      if (extractedCommand.endsWith("please")) {
        const finalCommand = extractedCommand.slice(0, -6).trim(); // Remove "please" from the command
        handleVoiceCommand(finalCommand);
      }
    }
  };

  recognition.onerror = function (event) {
    console.error("Voice recognition error:", event.error);
    displayMessage("Voice recognition error occurred.");
    playSound("sfx/error-sound.mp3");
  };

  recognition.onend = function () {
    console.log("Voice recognition ended.");
    displayMessage("Voice recognition ended.");
    playSound("sfx/end-sound.mp3");
    // Enable the voice recognition toggle button on end
    document.getElementById("voice-toggle").disabled = false;
  };

  recognition.start();
}

// Function to stop voice recognition
function stopVoiceRecognition() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

// Function to toggle voice recognition
function toggleVoiceRecognition() {
  const toggleButton = document.getElementById("voice-toggle");

  if (recognition) {
    stopVoiceRecognition();
    toggleButton.textContent = "";
  } else {
    startVoiceRecognition();
    toggleButton.textContent = "";
  }
}

// Function to display a message
function displayMessage(message) {
  const messageElement = document.getElementById("voice-message");
  messageElement.textContent = message;
}

// Function to play a sound
function playSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.play();
}

// Function to speak text
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);

  // Get the list of available voices
  const voices = window.speechSynthesis.getVoices();

  // Find a female voice
  const femaleVoice = voices.find((voice) =>
    voice.name.toLowerCase().includes("female")
  );

  // Set the voice to the female voice if available
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Add event listener to the voice recognition toggle button
document
  .getElementById("voice-toggle")
  .addEventListener("click", toggleVoiceRecognition);
