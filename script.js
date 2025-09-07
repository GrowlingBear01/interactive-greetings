let audioContext = null;
let videoSource = null;
let gainNode = null;

window.onload = () => {

   // --- ADD THIS NEW BLOCK FOR THE START SCREEN ---
  const startOverlay = document.getElementById('start-overlay');
  const startBtn = document.getElementById('start-btn');
  const bgMusic = document.getElementById('bgMusic');

  // Inside your window.onload function in script.js

// --- Replace your old fadeAudio function with this upgraded version ---
function fadeAudio(audio, options) {
    if (!audio) return;

    // This new part prevents overlapping fades on the same element
    if (audio.fadeInterval) {
        clearInterval(audio.fadeInterval);
    }

    const { to, duration = 1000, from = audio.volume, start = false } = options;
    const originalVolume = 0.05; // Your original background music volume
    const finalTo = (audio.id === 'bgMusic' && to > originalVolume) ? originalVolume : to;
    const step = (finalTo - from) / (duration / 50);

    if (from === finalTo) {
        if (start) audio.play();
        return;
    };
    if (start && finalTo > 0) audio.play();
    audio.volume = from;

    audio.fadeInterval = setInterval(() => {
        const newVolume = audio.volume + step;
        if ((step > 0 && newVolume >= finalTo) || (step < 0 && newVolume <= finalTo)) {
            audio.volume = finalTo;
            if (finalTo === 0) audio.pause();
            clearInterval(audio.fadeInterval);
            audio.fadeInterval = null;
        } else {
            audio.volume = newVolume;
        }
    }, 50);
}
   

  // 🌸 Force start at Scene 1
  let currentScene = 0;
  const wrapper = document.getElementById("wrapper");
  window.scrollTo(0, 0);
  document.body.style.overflow = "hidden";

  // 🌸 Typing Effect – Scene 1
// Replace your old typeText function with this new one
// Replace your entire `typeText` function with this final version
function typeText() {
    const textContainer = document.getElementById("typingText");
    const scrollBtn1 = document.getElementById("nextBtn1");
    const wrapper = document.getElementById("wrapper"); // Make sure we have the wrapper
    if (!textContainer || !scrollBtn1 || !wrapper) return;

    const fullText = `Hey ___! 💫
It’s Girlfriend Day but relax, I’m not here to propose 😅
I just think this day’s more than hearts and roses...
It’s about appreciating the women who brighten our lives like YOU.
The ones who show up with kindness, chaos, and kitty-core energy ✨
This page? Just a soft little thank you from me
for all the invisible things you do that never go unnoticed. 💜
So yeah... don’t scroll too fast just take this in for a sec. ✨`;

    textContainer.innerHTML = "";
    const lines = fullText.split('\n');
    const emphasisWords = ["YOU.", "kindness,", "chaos,", "energy"];
    let wordDelay = 100;

    // This new logic processes the text line by line, preserving the layout
    lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'intro-line';
        textContainer.appendChild(lineDiv);

        const words = line.split(' ');
        words.forEach(word => {
            if (word.length === 0) return;

            const wordSpan = document.createElement("span");
            wordSpan.className = "intro-word";
            wordSpan.textContent = word + " ";

            if (emphasisWords.includes(word)) {
                wordSpan.classList.add("emphasis");
            }

            setTimeout(() => {
                lineDiv.appendChild(wordSpan);
            }, wordDelay);

            wordDelay += 180;//speed of words
        });
    });

    // Show the button AND add its click event listener
    setTimeout(() => {
        scrollBtn1.classList.remove("hidden");

        // --- FIX FOR THE BUTTON ---
        // This adds the "click" functionality back to the button.
        scrollBtn1.addEventListener("click", () => {
            currentScene = 1;
            wrapper.style.transform = "translateY(-100vh)";
            setTimeout(() => {
                animateScene2(); 
            }, 1000);
        });
        // --------------------------

    }, wordDelay + 500);
}
// --- Replace the entire interactive kitty + failsafe block with this final version ---
// --- Replace all of your Scene 1 interactivity code with this corrected block ---

const scene1 = document.getElementById('scene1');
const kitty = document.querySelector('.kitty');
let hasTextStarted = false;
let kittyHintInterval = null;
let textHintTimer = null;
let hintIteration = 0;

if (scene1 && kitty) {
    // This function is the master trigger for starting the text animation
    const startTheShow = () => {
        if (hasTextStarted) return; // Prevent it from running more than once
        hasTextStarted = true;

        // Stop all hint timers
        clearInterval(kittyHintInterval);
        clearTimeout(textHintTimer);
        document.querySelectorAll('.popup-media').forEach(el => el.remove());

        // Remove any visible hint elements
        const existingHint = document.querySelector('.kitty-hint-bubble');
        if (existingHint) existingHint.remove();
        const existingRipples = document.querySelectorAll('.kitty-ripple');
        existingRipples.forEach(ripple => ripple.remove());

        // Stop the chime sound and fade the background music back in
        const chimeSound = document.getElementById('kittyChime');
        if (chimeSound) {
            chimeSound.pause();
            chimeSound.currentTime = 0;
        }
        fadeAudio(bgMusic, { to: 0.01, duration: 2000,start: true });

        // Finally, start the text animation
        typeText();
    };

    // This function creates the hint visuals and sound (no changes here)
    const createRippleBurst = () => {
        if (hasTextStarted) return;
        if (hintIteration === 0) {
            textHintTimer = setTimeout(() => {
                if (hasTextStarted || document.querySelector('.kitty-hint-bubble')) return;
                const kittyRect = kitty.getBoundingClientRect();
                const hint = document.createElement('div');
                hint.className = 'kitty-hint-bubble';
                hint.innerHTML = 'Psst... try hovering over me! 🐾';
                hint.style.left = `${kittyRect.left + kittyRect.width / 2}px`;
                hint.style.top = `${kittyRect.top - 120}px`;
                document.body.appendChild(hint);
            }, 20000);
        }
        hintIteration++;
        const animationDuration = 15000;
        const maxIterations = 4;
        const progress = Math.min((hintIteration - 1) / (maxIterations - 1), 1);
        const targetVolume = 0.2 + (progress * 0.8);
        fadeAudio(bgMusic, { to: 0, duration: 500 });
        const chimeSound = document.getElementById('kittyChime');
        if (chimeSound) {
            chimeSound.currentTime = 0;
            fadeAudio(chimeSound, { from: 0, to: targetVolume, duration: animationDuration, start: true });
        }
        const startScale = 4;
        const fullScreenScale = Math.max(window.innerWidth, window.innerHeight) / 80;
        const scale = startScale + (progress * (fullScreenScale - startScale));
        const borderWidth = 3 + (progress * 5);
        const shadowBlur = 15 + (progress * 20);
        const shadowSpread = 5 + (progress * 10);
        const rippleCount = 3;
        for (let i = 0; i < rippleCount; i++) {
            const kittyRect = kitty.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'kitty-ripple';
            ripple.style.left = `${kittyRect.left + kittyRect.width / 2}px`;
            ripple.style.top = `${kittyRect.top + kittyRect.height / 2}px`;
            ripple.style.borderWidth = `${borderWidth}px`;
            ripple.style.boxShadow = `0 0 ${shadowBlur}px ${shadowSpread}px rgba(232, 180, 255, 0.7), inset 0 0 10px rgba(255, 255, 255, 0.5)`;
            ripple.style.setProperty('--ripple-scale', scale);
            document.body.appendChild(ripple);
            setTimeout(() => {
                ripple.style.animationPlayState = 'running';
            }, i * 600);
            setTimeout(() => ripple.remove(), animationDuration + (i * 600));
        }
    const mediaItems = [
                { type: 'gif', src: 'assets/popup-kitty.gif', duration: 15000 },
                { type: 'video', src: 'assets/kitty-dance-1.mp4', duration: 15000 },
                { type: 'video', src: 'assets/kitty-dance-2.mp4', duration: 15000 }
            ];
            const randomMedia = mediaItems[Math.floor(Math.random() * mediaItems.length)];
            let mediaElement;

            if (randomMedia.type === 'gif') {
                mediaElement = document.createElement('img');
                mediaElement.className = 'popup-media popup-gif';
            } else {
                mediaElement = document.createElement('video');
                mediaElement.autoplay = true;
                mediaElement.loop = true;
                mediaElement.muted = true;
                mediaElement.playsInline = true;
                mediaElement.className = 'popup-media popup-video';
            }

            mediaElement.src = randomMedia.src;
            mediaElement.style.top = `${Math.random() * 70 + 15}vh`;
            mediaElement.style.left = `${Math.random() * 70 + 15}vw`;
            document.body.appendChild(mediaElement);

            setTimeout(() => {
                mediaElement.remove();
            }, randomMedia.duration);
    };

    // The "Click to Begin" button listener
    startBtn.addEventListener('click', () => {
        fadeAudio(bgMusic, { to: 0.01, duration: 1500, start: true });
        startOverlay.classList.add('hidden');
        document.body.classList.add('scene-active');

        // This is the key: The hint countdown starts AFTER the user clicks "Begin"
        setTimeout(() => {
            if (hasTextStarted) return;
            createRippleBurst();
            kittyHintInterval = setInterval(createRippleBurst, 16000); // Using 16s to match 15s audio
        }, 10000);
    });

    // The Kitty Interaction Listener
    scene1.addEventListener('mousemove', (e) => {
        const kittyRect = kitty.getBoundingClientRect();
        const kittyX = kittyRect.left + kittyRect.width / 2;
        const kittyY = kittyRect.top + kittyRect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const distance = Math.sqrt(Math.pow(mouseX - kittyX, 2) + Math.pow(mouseY - kittyY, 2));

        if (distance < 100) {
            kitty.classList.add('interactive');
            startTheShow(); // Hovering the kitty is what calls startTheShow
        } else {
            kitty.classList.remove('interactive');
        }
    });
}


// typeText(); // Start typing effect for Scene 1



  // Helper function to create a sparkle effect at a specific position
//final version
function createSparkle(x, y) {
    const container = document.getElementById('sparkle-container');
    if (!container) return;

    // --- 1. Create the initial flash effect ---
    const flash = document.createElement('div');
    flash.className = 'flash';
    container.appendChild(flash);
    flash.style.left = `${x}px`;
    flash.style.top = `${y}px`;
    setTimeout(() => flash.remove(), 400); // Clean up the flash element

    // --- 2. Create the particles with a gravity arc ---
    const sparkleCount = 12; // A nice, full burst
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        container.appendChild(sparkle);

        const size = Math.random() * 10 + 5; // Random size from 5px to 15px
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x}px`; // Start all particles at the burst point
        sparkle.style.top = `${y}px`;

        // Calculate a random destination
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 60 + 40; // Fly out between 40px and 100px
        const destinationX = Math.cos(angle) * radius;
        const destinationY = Math.sin(angle) * radius;
        const duration = Math.random() * 0.8 + 0.7; // Duration from 0.7s to 1.5s

        // Animate with a 3-point gravity-like arc
        sparkle.animate([
            { // Start point
                transform: 'scale(0)',
                opacity: 1
            },
            { // Mid-point (the peak of the arc)
                transform: `translate(${destinationX * 0.5}px, ${destinationY * 0.5 - 20}px) scale(1.2)`, // The "-20px" creates the upward arc
                opacity: 1
            },
            { // End point (where it "lands" after falling)
                transform: `translate(${destinationX}px, ${destinationY + 40}px) scale(0)`, // The "+40px" creates the "gravity" pull
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'ease-out',
            fill: 'forwards'
        });

        // Clean up the particle element after its animation
        setTimeout(() => sparkle.remove(), duration * 1000);
    }
}

  // 🌸 Scene 2 Typing Effect
async function animateScene2() {
    const lines = [
        "Some people move fast. You move gently. And that’s a kind of magic.",
        "You’ve got that Hello Kitty logic — soft blankets, peaceful vibes, and main-character calm",
        "You're not lazy — you're just living like royalty. And it suits you"
    ];
    
    // Select all elements
    const scene2Container = document.getElementById("scene2");
    const line1 = document.getElementById("line1");
    const line2 = document.getElementById("line2");
    const line3 = document.getElementById("line3");
    const scene2Gif = document.getElementById("scene2Gif");
    const scrollBtn2 = document.getElementById("nextBtn2");
    
    const emojiTeddy = document.getElementById("emoji-teddy");
    const emojiStrawberry = document.getElementById("emoji-strawberry");
    const emojiCrown = document.getElementById("emoji-crown");
    const emojiSparkles = document.getElementById("emoji-sparkles");

    const allEmojis = [emojiSparkles, emojiTeddy, emojiStrawberry, emojiCrown];
    allEmojis.forEach(el => {
        el.style.opacity = 0;
        el.classList.remove('roaming');
    });

    // Helper function to get an element's position relative to its parent
    function getRelativePosition(element, parent) {
        const parentRect = parent.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        return {
            top: elementRect.top - parentRect.top,
            left: elementRect.left - parentRect.left
        };
    }

    // Clear the text
    line1.innerHTML = lines [0] + ' <span id="sparkles-placeholder" class="emoji-placeholder"></span>';
    line2.innerHTML = lines [1] + ' <span id="teddy-placeholder" class="emoji-placeholder"></span><span id="strawberry-placeholder" class="emoji-placeholder"></span>';
    line3.innerHTML = lines [2] + ' <span id="crown-placeholder" class="emoji-placeholder"></span>';

    // --- Animation Sequence ---

    // Animate line 1 and make sparkles roam
    await new Promise(resolve => setTimeout(resolve, 500));
    line1.style.animation = 'slideInLeft 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';
    await new Promise(resolve => setTimeout(resolve, 1000));
    emojiSparkles.style.top = `${Math.random() * 50}vh`; // Random initial top position
    emojiSparkles.style.left = `${Math.random() * 100}vw`; // Random initial left position
    emojiSparkles.style.opacity = 1;
    emojiSparkles.classList.add('roaming');

    // Animate line 2 and make teddy/strawberry roam
    await new Promise(resolve => setTimeout(resolve, 1000));
    line2.style.animation = 'slideInRight 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';
    await new Promise(resolve => setTimeout(resolve, 1000));
    emojiTeddy.style.top = `${Math.random() * 50}vh`; // Random initial top position
    emojiTeddy.style.left = `${Math.random() * 100}vw`; // Random initial left position
    emojiTeddy.style.opacity = 1;
    emojiTeddy.classList.add('roaming');
    emojiStrawberry.style.top = `${Math.random() * 50}vh`; // Random initial top position
    emojiStrawberry.style.left = `${Math.random() * 100}vw`; // Random initial left position
    emojiStrawberry.style.opacity = 1;
    emojiStrawberry.classList.add('roaming');

    // Animate line 3 and make crown roam
    await new Promise(resolve => setTimeout(resolve, 1000));
    line3.style.animation = 'slideInBottom 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';
    await new Promise(resolve => setTimeout(resolve, 1000));
    emojiCrown.style.top = `${Math.random() * 50}vh`; // Random initial top position
    emojiCrown.style.left = `${Math.random() * 100}vw`; // Random initial left position
    emojiCrown.style.opacity = 1;
    emojiCrown.classList.add('roaming');

    // Fade in the GIF
    await new Promise(resolve => setTimeout(resolve, 1000));
    scene2Gif.classList.remove("hidden");
    scene2Gif.style.animation = 'popInGif 0.8s ease-in-out forwards, pulse-strong 2s infinite ease-in-out 0.8s';

    // Show the button
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (scrollBtn2) {
        scrollBtn2.classList.remove("hidden");
        scrollBtn2.classList.add("show-button");
    }

    // --- FINAL EMOJI SETTLE DOWN ---
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Stop roaming and apply final positions with a smooth transition
    const sparklesPos = getRelativePosition(document.getElementById("sparkles-placeholder"), scene2Container);
    emojiSparkles.classList.remove('roaming');
    emojiSparkles.style.top = `${sparklesPos.top - 5}px`;
    emojiSparkles.style.left = `${sparklesPos.left}px`;
    emojiSparkles.style.transform = 'translateY(0) scale(1)';
    createSparkle(sparklesPos.left + 15, sparklesPos.top + 15);

    const teddyPos = getRelativePosition(document.getElementById("teddy-placeholder"), scene2Container);
    const strawberryPos = getRelativePosition(document.getElementById("strawberry-placeholder"), scene2Container);
    emojiTeddy.classList.remove('roaming');
    emojiTeddy.style.top = `${teddyPos.top - 5}px`;
    emojiTeddy.style.left = `${teddyPos.left}px`;
    emojiTeddy.style.transform = 'translateY(0) scale(1)';
    createSparkle(teddyPos.left + 15, teddyPos.top + 15);
    emojiStrawberry.classList.remove('roaming');
    emojiStrawberry.style.top = `${strawberryPos.top - 5}px`;
    emojiStrawberry.style.left = `${strawberryPos.left}px`;
    emojiStrawberry.style.transform = 'translateY(0) scale(1)';
     
    createSparkle(strawberryPos.left + 15, strawberryPos.top + 15);

    const crownPos = getRelativePosition(document.getElementById("crown-placeholder"), scene2Container);
    emojiCrown.classList.remove('roaming');
    emojiCrown.style.top = `${crownPos.top - 5}px`;
    emojiCrown.style.left = `${crownPos.left}px`;
    emojiCrown.style.transform = 'translateY(0) scale(1)';
    createSparkle(crownPos.left + 15, crownPos.top + 15);
    
    // Add the click event listener after everything has settled
    scrollBtn2.addEventListener("click", () => {
        currentScene = 2;
        wrapper.style.transform = "translateY(-200vh)";
        setTimeout(() => {
            typeText3();
        }, 1000);
    });
}

// Update the navigation to call the new function


  // 🌸 Scene 3 Typing Effect
  const text3 = `You know what’s wild, ______?

You never even realized how much you helped me.

Like... those small check-ins, your weird jokes, your just-being-there energy?

Yeah. That helped.

You made heavy days feel lighter without even trying. 💫`;

  let k = 0;
  const typingEl3 = document.getElementById("typingText3");
  const scrollBtn3 = document.getElementById("toScene4");

  function typeText3() {
    const container = document.getElementById("typingText3");
    if (!container) return;
    container.innerHTML = ""; // Clear the container

    const words = text3.trim().split(/\s+/); // Split by one or more spaces
    let wordDelay = 0;
    const delayPerWord = 180; // Milliseconds between each word

    words.forEach(word => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word-animate";
        wordSpan.textContent = word + " ";
        wordSpan.style.opacity = 0;
        wordSpan.style.transform = "translateY(10px)";

        // Append the word, then start its animation after a delay
        setTimeout(() => {
            container.appendChild(wordSpan);
            wordSpan.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
            wordSpan.style.opacity = 1;
            wordSpan.style.transform = "translateY(0)";
        }, wordDelay);

        wordDelay += delayPerWord;
    });

    // When all words are done, show the button
    setTimeout(() => {
        if (scrollBtn3) {
            scrollBtn3.classList.remove("hidden");
            scrollBtn3.classList.add("is-visible"); // Use the new visible class

            scrollBtn3.addEventListener("click", () => {
                currentScene = 3;
                wrapper.style.transform = "translateY(-300vh)";
                setTimeout(() => {
                    if (typingEl4) {
                        typingEl4.textContent = "";
                        typeText4();
                    }
                }, 1000);
            });
        
          }

    }, wordDelay + 500); // Add a small pause at the end
}

  let scene3Triggered = false;
  window.addEventListener("scroll", () => {
    const scene3 = document.getElementById("scene3");
    const rect = scene3.getBoundingClientRect();
    if (!scene3Triggered && rect.top < window.innerHeight - 100) {
      scene3Triggered = true;
      
      typeText3();
    }
  });

  // 🌸 Scene 4 Typing Effect
// 🌸 Scene 4 Typing Effect (Cozy Storm Version)
const text4 = `Okay, real talk...You’re the kind of girl who makes poets panic — like, how do you even put that into words? ✨
Soft where it matters. Strong when it counts.
You carry peace and power like a cozy little storm ☁️⚡
Also — your laugh? It should honestly be bottled and sold as serotonin 💌
You're main character energy, always.
And I’m just glad our stories crossed paths. 🌷`;

let m = 0;
const typingEl4 = document.getElementById("typingText4");
const scene4Btn = document.getElementById("toScene5");

function typeText4() {
  if (m < text4.length) {
    typingEl4.textContent += text4.charAt(m);
    m++;
    setTimeout(typeText4, 40);
  } else {
    // When typing finishes...
    document.getElementById('scene4').classList.add('spotlight-active');

    const stickerContainer = document.querySelector('.sticker-container');
    const spotlight = document.querySelector('.spotlight');

    if (stickerContainer && spotlight) {
      // Get the width of the container holding the image and box
      const containerWidth = stickerContainer.offsetWidth;

      // Set the spotlight's width to be the container's width + 100px of padding
      const spotlightWidth = containerWidth + 100; 

      // Apply the new dynamic width
      spotlight.style.width = `${spotlightWidth}px`;
    }
    // Get the sticker element
    const stickerImage = document.getElementById('scene4Sticker');
    const cloudyBox = document.getElementById('cloudyBox');
    // After 500ms, make the sticker visible
    setTimeout(() => {
      if (stickerImage) {
        stickerImage.classList.add('visible');
      }
      if (cloudyBox) {
    cloudyBox.classList.add('visible'); // ✅ Add this line to show the box
  }
    }, 500);

    // After 2 seconds, make the button visible
    setTimeout(() => {
      if (scene4Btn) {
  scene4Btn.style.opacity = '1';
  scene4Btn.style.transform = 'translateY(0)';
  scene4Btn.classList.remove("hidden");
}
    }, 2000);
  }
}

let scene4Triggered = false;
window.addEventListener("scroll", () => {
  const scene4 = document.getElementById("scene4");
  const rect = scene4.getBoundingClientRect();
  if (!scene4Triggered && rect.top < window.innerHeight - 100) {
    scene4Triggered = true;
    typingEl4.textContent = "";
    typeText4();
  }
});


scene4Btn.addEventListener("click", () => {
  
  currentScene = 4;
  wrapper.style.transform = "translateY(-400vh)";
  setTimeout(checkScene5Trigger, 1000);
});

let petalInterval;

// --- Replace your startPetalStorm function with this ---
function startPetalStorm() {
   const petalContainer = document.getElementById("petal-container");
  petalInterval = setInterval(() => {
    const petal = document.createElement("div");
    petal.classList.add("petal");

    petal.style.left = `${Math.random() * 100}vw`;
    const size = Math.random() * 15 + 10;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    const duration = Math.random() * 4 + 5; // 5s to 9s fall time
    petal.style.animationDuration = `${duration}s`;
    
    // This adds a random horizontal drift to the fall
    petal.style.setProperty('--drift', Math.random() * 2 - 1);

    const petalLabels = [
      'Kindness 💜', 'Cuteness 🧸', 'Chaos 😼', 'Calm 🌙',
      'Vibes ✨', 'Lavender 💐', 'Love 💌', 'Main Character 🎬'
    ];

    if (Math.random() < 0.15) {
      const label = document.createElement("span");
      label.classList.add("petal-label");
      label.textContent = petalLabels[Math.floor(Math.random() * petalLabels.length)];
      petal.appendChild(label);
    }

    petalContainer.appendChild(petal);
    
    // Clean up the petal from the DOM after it has fallen and rested for a while
    //setTimeout(() => petal.remove(), duration * 1000 + 5000);

  }, 50); // Increased frequency for a fuller storm
}
function fallAllPetals() {
  const petals = document.querySelectorAll(".petal");
  petals.forEach((petal) => {
    petal.style.animation = "fall-burst 1.2s ease-in forwards";
  });
}


function stopPetalStorm() {
  clearInterval(petalInterval);
  petalInterval = null;
}




  // 🌸 Scene 5: Awesomeness Scan
function runScanScene5() {
  startPetalStorm();

  const scanMessages = [
    "🧠 Emotional intelligence… unlocked 💡", "💜 Kindness core… radiant 💫",
    "🎀 Cuteness overload… dangerously high 🧸", "😼 Chaotic good vibes… confirmed 😻",
    "✨ Lavender logic… detected 💐", "📎 Personality: Certified Main Character™ 🌸"
  ];

  const scanTitle = document.querySelector(".scan-title");
  const scanLog = document.getElementById("scanLog");
  const scanBar = document.querySelector(".scan-bar");
  const scanProgress = document.getElementById("scanProgress");
  const certificate = document.getElementById("certificate");
  const kittyVideoPopup = document.getElementById("kittyVideoPopup");
  const kittyVideo = document.getElementById("kittyVideo");
  const finalMessage = document.getElementById("finalMessage");
  const scanFinalContent = document.getElementById('scanFinalContent');

  // Reset states
  scanLog.innerHTML = "";
  scanProgress.style.animation = "";
  certificate.classList.add("hidden");
  kittyVideoPopup.classList.add("hidden");
  scanFinalContent.classList.remove('visible');
  scanFinalContent.innerHTML = '';
  scanTitle.style.display = 'block';
  scanLog.style.display = 'block';
  scanBar.style.display = 'block';

  let s = 0;
  const delayPerLine = 900;
  const totalDuration = scanMessages.length * delayPerLine;

  scanProgress.style.animation = `fill-progress-bar ${totalDuration / 1000}s linear forwards`;

  function nextStep() {
    if (s < scanMessages.length) {
      const line = document.createElement("div");
      line.textContent = scanMessages[s];
      line.classList.add("scan-line");
      scanLog.appendChild(line);
      scanLog.scrollTop = scanLog.scrollHeight;
      s++;
      setTimeout(nextStep, delayPerLine);
    } else {
      const bgAudio = document.getElementById("bgMusic");
      stopPetalStorm();
      
      setTimeout(() => certificate.classList.remove("hidden"), 500);
      setTimeout(() => {
        if (bgAudio) fadeAudio(bgAudio, { to: 0, duration: 500 }); // Fade out for video
        kittyVideoPopup.classList.remove("hidden");
        kittyVideo.play();
      }, 2000);

      // --- THIS IS THE UPDATED CERTIFICATE LOGIC ---
      // --- Replace your existing kittyVideo.onended handler with this ---
kittyVideo.onended = () => {
    kittyVideoPopup.classList.add("hidden");
    
    // Hide all the old scanning elements
    scanTitle.style.display = 'none';
    scanLog.style.display = 'none';
    scanBar.style.display = 'none';
    certificate.style.display = 'none';

    // --- NEW DELUXE CERTIFICATE LOGIC ---

    // 1. Generate dynamic certificate details
    const today = new Date();
    const issueDate = today.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const certNumber = `HK-${Math.floor(Math.random() * 900000) + 100000}`;

    // 2. Build the new, richer certificate HTML
    scanFinalContent.innerHTML = `
        <div class="seal">🎖️</div>
        <p class="recipient-name">_____ is officially Certified Awesome™</p>
        <hr class="seal-line">
        <p class="tagline">💜 Soft, rare, and impossible to forget — just like you.</p>
        <div class="certificate-details">
            <p>Issued on: ${issueDate}</p>
            <p>Cert. No: ${certNumber}</p>
            <p>Issued by: The Official Hello Kitty Bureau of Cuteness</p>
        </div>
    `;

    // 3. Move the 'Next' button into the certificate
    const nextBtn = document.getElementById('toScene6');
    if (nextBtn) {
        finalMessage.classList.remove('hidden'); 
        finalMessage.style.opacity = '0';      
        scanFinalContent.appendChild(nextBtn); 
    }
    
    // 4. Make the new content visible
    scanFinalContent.classList.add('visible');
    
    // 5. Fade the background music back in
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic) fadeAudio(bgMusic, { to: 0.01, duration: 2000, start: true });
};
    }
  }
  nextStep();
}


 let scene5Triggered = false;
let scanStartButtonBound = false;

function checkScene5Trigger() {
  if (currentScene === 4 && !scene5Triggered) {
    scene5Triggered = true;

    const prePrompt = document.getElementById("preScanPrompt");
    const scanContainer = document.querySelector(".scan-container");
    const startScanBtn = document.getElementById("startScanBtn");

    prePrompt.style.display = "block";
    scanContainer.style.display = "none";

    // ✅ Only bind this once
    if (!scanStartButtonBound) {
      scanStartButtonBound = true;
      startScanBtn.addEventListener("click", () => {
        prePrompt.style.display = "none";
        scanContainer.style.display = "block";
        runScanScene5();
      });
    }
  }
}


  // 🌙 Scene 6 Typing Effect
const text6 = ` That’s it, _____ 💜
This wasn’t about being perfect.
It was just a soft, honest thank-you — 
for being you.
You're not just kind. You're impactfully kind.
You're not just cute. You're meaningfully warm.
And I’m so, so glad you exist in this weird little world 💫`;

let n = 0;
const typingEl6 = document.getElementById("typingText6");

function typeText6() {
    const container = document.getElementById("typingText6");
    if (!container) return;
    container.innerHTML = "";

    const lines = text6.trim().split('\n');
    let wordDelay = 0;
    const typingSpeed = 200;

    lines.forEach(lineText => {
        const lineDiv = document.createElement("div");
        container.appendChild(lineDiv);
        const words = lineText.trim().split(' ');
        
        words.forEach(word => {
            if (word) {
                const wordSpan = document.createElement("span");
                wordSpan.className = "fall-word";
                wordSpan.textContent = word + " ";
                wordSpan.style.opacity = 0;
                wordSpan.style.transform = "translateY(10px)";
                wordSpan.style.transition = "opacity 0.3s, transform 0.3s";

                setTimeout(() => {
                    lineDiv.appendChild(wordSpan);
                    setTimeout(() => {
                        wordSpan.style.opacity = 1;
                        wordSpan.style.transform = "translateY(0)";
                    }, 10);
                }, wordDelay);

                wordDelay += typingSpeed;
            }
        });
    });

    // ✅ NEW, SMOOTHER HANDOFF:
    // After typing finishes, wait 1 second, then start the fade-out.
    setTimeout(() => {
        const words = document.querySelectorAll("#typingText6 .fall-word");
        words.forEach(word => {
            word.style.transition = "opacity 0.5s ease-out";
            word.style.opacity = 0;
        });

        // After the words have faded out (500ms), start the final animation.
        setTimeout(startFinalAnimation, 600); 
    }, wordDelay + 1000);
}


function startFinalAnimation() {
    // --- 1. Element Selection ---
    const video = document.getElementById("kittyGoodbyeVideo");
    const thankYou = document.getElementById("finalThankYouMessage");
    const replayBtn = document.getElementById("replayBtn");
    const scene6Container = document.getElementById("scene6");
    const words = Array.from(document.querySelectorAll("#typingText6 .fall-word"));
  

    let floatAnimationId = null;
    const wordRotations = [];

    // --- 2. Safety Check ---
    if (!video || !thankYou || !replayBtn || !scene6Container || words.length === 0) {
        console.error("CRITICAL ERROR: One or more Scene 6 elements are missing.");
        return;
    }
    
    
    // --- 3. High-Performance Bunching Animation ---
    const bunchingPoint = {
        top: window.innerHeight * 0.6,
        left: window.innerWidth * 0.1
    };

    const initialPositions = words.map(word => word.getBoundingClientRect());

    words.forEach((word, index) => {
        const initialPos = initialPositions[index];
        const rotation = (Math.random() - 0.5) * 15;
        wordRotations.push(rotation);

        const xOffset = initialPos.left - bunchingPoint.left;
        const yOffset = initialPos.top - bunchingPoint.top;

        word.style.position = 'absolute';
        word.style.top = `${bunchingPoint.top}px`;
        word.style.left = `${bunchingPoint.left}px`;
        word.style.margin = '0';
        word.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`;
        word.style.transition = `transform 2.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.8s ease-in`;
        
        scene6Container.appendChild(word);
    });

    // Start the bunching motion for the words
    setTimeout(() => {
        words.forEach((word, index) => {
            word.style.opacity = 1;
            word.style.transform = `translateX(-50%) rotate(${wordRotations[index]}deg)`;
        });
    }, 100);

    // ✅ **NEW: Delayed Video Playback**
    // You can change this value to adjust the delay (in milliseconds).
    const videoDelay = 2000; // 2-second delay

    setTimeout(() => {
        video.classList.remove("hidden");
        video.currentTime = 0;
        video.play();
    }, videoDelay);


    // --- 4. Subsequent Animations (Floating, Exploding) ---
    // The rest of the function remains the same.
    setTimeout(() => {
        const startTime = Date.now();
        function floatLoop() {
            const yOffset = Math.sin((Date.now() - startTime) / 800) * 40; 
            words.forEach((word, index) => {
                const rotation = wordRotations[index];
                word.style.transform = `translateX(-50%) translateY(${yOffset}px) rotate(${rotation}deg)`;
            });
            floatAnimationId = requestAnimationFrame(floatLoop);
        }
        floatLoop();
    }, 2700);

    setTimeout(() => {
        if (floatAnimationId) {
            cancelAnimationFrame(floatAnimationId);
        }
        words.forEach((word, index) => {
            const rotation = wordRotations[index];
            word.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
            setTimeout(() => {
                const x = (Math.random() - 0.5) * 600;
                const y = (Math.random() - 0.5) * 400;
                const rot = (Math.random() - 0.5) * 720;
                word.style.setProperty('--explode-x', `${x}px`);
                word.style.setProperty('--explode-y', `${y}px`);
                word.style.setProperty('--explode-rot', `${rot}deg`);
                word.classList.add('explode');
                setTimeout(() => {
                    word.classList.remove('explode');
                    word.classList.add('drop');
                    word.style.left = `${Math.random() * (window.innerWidth - 80)}px`;
                    word.style.top = `calc(100vh - 60px)`;
                    word.style.transform = 'none';
                }, 700);
            }, index * 40);
        });

        const totalAnimationTime = (words.length * 40) + 700;
        setTimeout(() => {
            replayBtn.classList.remove("hidden");
        }, totalAnimationTime);

        setTimeout(() => {
            thankYou.classList.remove("hidden");
        }, totalAnimationTime + 1000);

    }, 5000);//time before explosion
}


document.getElementById("toScene6").addEventListener("click", () => {
  currentScene = 5;
  wrapper.style.transform = "translateY(-500vh)";
  setTimeout(() => {
    if (typingEl6) {
      typingEl6.textContent = "";
      typeText6();
    }
  }, 1000);
});





  // 🌸 Navigation Buttons
  if (scrollBtn1) {
    scrollBtn1.addEventListener("click", () => {
        currentScene = 1;
        wrapper.style.transform = "translateY(-100vh)";
        setTimeout(() => {
            // Call the new animation function
            animateScene2(); 
        }, 1000);
    });
}

  if (scrollBtn2) {
    scrollBtn2.addEventListener("click", () => {
      currentScene = 2;
      wrapper.style.transform = "translateY(-200vh)";
      setTimeout(() => {
        if (typingEl3) {
          typingEl3.textContent = "";
          typeText3();
        }
      }, 1000);
    });
  }

 if (scrollBtn3) {
  scrollBtn3.addEventListener("click", () => {
    currentScene = 3;
    wrapper.style.transform = "translateY(-300vh)";
    setTimeout(() => {
      if (typingEl4) {
        typingEl4.textContent = "";
        typeText4();
      }
    }, 1000);
  });
}

  const scrollBtnToScene5 = document.getElementById("nextBtnToScene5");
  if (scrollBtnToScene5) {
    scrollBtnToScene5.addEventListener("click", () => {
      currentScene = 4;
      wrapper.style.transform = "translateY(-400vh)";
      setTimeout(checkScene5Trigger, 1000);
    });
  }

  if (scene4Btn) {
    scene4Btn.addEventListener("click", () => {
      currentScene = 4;
      wrapper.style.transform = "translateY(-400vh)";
      setTimeout(checkScene5Trigger, 1000);
    });
  }

  if (toScene6Btn) {
  toScene6Btn.addEventListener("click", () => {
    currentScene = 5;
    wrapper.style.transform = "translateY(-500vh)";
    setTimeout(() => {
      if (typingEl6) {
        typingEl6.textContent = "";
        typeText6();
      }
    }, 1000);
  });
}


  window.onbeforeunload = () => window.scrollTo(0, 0);
}

  function scrollToTop() {
  location.reload(); // soft reset
}




