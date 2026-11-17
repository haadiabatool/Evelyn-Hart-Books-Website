document.addEventListener('DOMContentLoaded', () => {
  // Inject Full Article Reader Modal dynamically into body
  const articleModalHTML = `
    <div class="article-modal-overlay" id="articleReaderModal">
      <div class="article-modal-box">
        <button type="button" class="article-modal-close" onclick="closeArticle()">&times;</button>
        <span id="modalArticleCategory" style="font-family:var(--font-label); font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; color:var(--secondary-color); display:block; margin-bottom:0.5rem;">CATEGORY</span>
        <h2 id="modalArticleTitle" style="font-family:var(--font-heading); font-size:2rem; font-weight:700; color:var(--primary-color); margin-bottom:1.25rem;">Article Title</h2>
        <div id="modalArticleBody" style="font-family:var(--font-body); font-size:0.98rem; line-height:1.8; color:var(--text-primary);">
          <!-- Full article text loaded dynamically -->
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', articleModalHTML);

  // Article Database for Full Content
  const articlesData = {
    1: {
      category: "Self-growth",
      title: "5 Habits for a Calmer Mind",
      content: "In our fast-paced world, mental clutter is often mistaken for productivity. However, true clarity comes from intentional stillness.<br> Here are five daily habits to help you cultivate peace:<br> <b>1. Morning Silence </b>(starting your day without screens for 20 minutes)<br> <b>2. Single-Tasking</b> (focusing on one thing at a time)<br> 3. <b>Evening Brain Dump</b> (writing down all lingering thoughts before bed)<br> 4.<b> Mindful Walking</b> <br>5. <b>Embracing JOMO</b> (the joy of missing out). Practice these consistently and watch your inner landscape transform."
    },
    2: {
      category: "Motivation",
      title: "How to Achieve Your Goals",
      content: "Big goals can feel overwhelming when viewed as a massive mountain.<br> The secret isn't more willpower; <b>it's better systems</b>.<br> Break every major ambition down into <b>micro-habits</b>.<br> If you want to write a book, commit to 200 words a day.<br> If you want better health, start with a 10-minute daily walk. Consistency beats intensity every single time.<br> Show up for your dreams in small doses, and compounding will do the rest.<br>Make Goals Specific and SMART<br>• <b>Be concrete:</b> Vague aspirations like <b>get in shape</b> or <b>save money</b> are too distant.<br><b>• Use SMART criteria:</b> Make sure your goals are Specific, Measurable, Achievable, Relevant, and Time-bound.<br>• Example: Instead of <b>I want to work out more</b>, set a goal to <b>walk for 30 minutes, three times a week</b>."
    },
    3: {
      category: "Life lessons",
      title: "The Power of Gratitude",
      content: "Gratitude is the conscious, mindful practice of recognizing and appreciating the positive moments, people, and experiences in your life, shifting your focus from what is lacking to what is present.<br>Gratitude is more than a polite sentiment; it is a neurological shift.<br> When we actively look for things to appreciate—the warmth of morning coffee, the sound of rain, a supportive message from a friend—we train our brain to notice abundance rather than scarcity.<br> Keep a nightly gratitude journal and write down three specific moments from your day. <br>You will quickly realize how rich your everyday life truly is.<br>What Happens in the Brain<br>• <b>Neurotransmitter Release:</b> Expressing and feeling gratitude triggers the release of dopamine and serotonin, key brain chemicals that immediately enhance mood, pleasure, and emotional well-being<br>• <b>Prefrontal Cortex Activation:</b> The practice activates the prefrontal cortex, supporting better critical thinking, emotional regulation, and rational thought processes.<br>• <b>Neural Rewiring:</b> Regular thankfulness counters the brain's natural negativity bias by building new neural pathways, making it easier for the mind to spot positive moments independently."
    },
    4: {
      category: "Inspiration",
      title: "Learning to Begin Again",
      content: "There is immense courage in starting over. <br>Whether it's a career pivot, a renewed personal relationship, or simply dusting yourself off after a failure, a fresh start is never a sign of weakness.<br> It is proof of resilience. Every experienced writer knows that the second draft is always better because of the lessons learned in the first. Give yourself grace and embrace the blank page.<b>Core Principles of Starting Over</b><br><b>• Embrace Small Steps:</b> Big changes rarely happen all at once. Simple, quiet acts—like cleaning your space, writing down a single goal, or taking a short walk—build real momentum.<br><b>• Drop the Need to Be Invisible:</b> When you start something new, you might want to hide your mistakes. Asking questions and seeking support from role models accelerates your progress.<b><br>• Differentiate Between Escape and Reinvention:</b> Running away from something out of fear is an escape, whereas building toward something intentional is true reinvention.<br>• <b>Practice Self-Compassion:</b> Missing a day of a routine or stumbling does not erase your progress. You can simply begin again in the next moment."
    },
    5: {
      category: "Reading",
      title: "Why Reading Changes Your Perspective",
      content: "Books are portable magic. When we read fiction or thoughtful essays, we temporarily step outside our own biases and walk in someone else's shoes. <br>This deep immersion expands our empathy, sharpens our vocabulary, and provides sanctuary from endless digital noise. Make reading a sacred daily ritual, even if it's just ten pages before sleep.<br><b>Active Mental Simulation</b><b>• Visual and Mental Construction:</b> Unlike watching a video where images are provided externally, reading forces your brain to generate sights, sounds, and entire worlds from scratch.<br><br><b>• Neural Wiring:</b> This heavy cognitive work strengthens neural connections across language, memory, and sensory processing regions through neuroplasticity.<br></br><b>• Pattern Recognition:</b> Deep reading trains the mind to move from concrete details to abstract concepts, helping you spot larger patterns in real-life situations."
    }
  };

  // Open Article Modal Function
  window.openArticle = function(id) {
    const article = articlesData[id];
    if (!article) return;

    document.getElementById('modalArticleCategory').textContent = article.category;
    document.getElementById('modalArticleTitle').textContent = article.title;
    document.getElementById('modalArticleBody').innerHTML = `<p>${article.content}</p>`;

    document.getElementById('articleReaderModal').classList.add('active');
  };

  // Close Article Modal Function
  window.closeArticle = function() {
    document.getElementById('articleReaderModal').classList.remove('active');
  };

  // Close on outside click or ESC
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('articleReaderModal');
    if (e.target === modal) closeArticle();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeArticle();
  });

// Slider Navigation Logic with Edge Detection (Dull/Bright Arrows)
  const track = document.getElementById('blogTrack');
  const prevBtn = document.getElementById('blogPrevBtn');
  const nextBtn = document.getElementById('blogNextBtn');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = track.querySelectorAll('.blog-card');
    const totalCards = cards.length;

    function updateArrows() {
      const cardsPerView = window.innerWidth > 992 ? 3 : (window.innerWidth > 650 ? 2 : 1);
      const maxIndex = totalCards - cardsPerView;

      // Left arrow dull agar start par hain
      if (currentIndex <= 0) {
        prevBtn.classList.add('disabled');
      } else {
        prevBtn.classList.remove('disabled');
      }

      // Right arrow dull agar end par hain
      if (currentIndex >= maxIndex) {
        nextBtn.classList.add('disabled');
      } else {
        nextBtn.classList.remove('disabled');
      }
    }

    function updateSlider() {
      const cardWidth = cards[0].getBoundingClientRect().width + 32; // width + gap
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateArrows();
    }

    nextBtn.addEventListener('click', () => {
      const cardsPerView = window.innerWidth > 992 ? 3 : (window.innerWidth > 650 ? 2 : 1);
      const maxIndex = totalCards - cardsPerView;
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    // Initial check
    updateArrows();
    window.addEventListener('resize', updateSlider);
  }
  });