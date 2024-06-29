
document.addEventListener('DOMContentLoaded', function() {
  const boxContainer = document.querySelector('.box-container');
  const searchInput = document.querySelector('.search-container input[type="text"]');
  const githubRawLink = 'https://raw.githubusercontent.com/TrackTrekk/_/main/posts.json'; // Replace with your actual link

  let postsData = [];

  // Fetch JSON data
  fetch(githubRawLink)
    .then(response => response.json())
    .then(data => {
      postsData = data;
      renderPosts(postsData);
    })
    .catch(error => console.error('Error fetching JSON:', error));

  // Function to render posts
  function renderPosts(posts) {
    boxContainer.innerHTML = ''; // Clear the container before rendering
    posts.forEach(post => {
      const box = document.createElement('div');
      box.classList.add('box');
      box.setAttribute('data-href', post.link);

      const img = document.createElement('img');
      img.src = post.image;
      img.alt = post.title;

      const title = document.createElement('div');
      title.classList.add('box-title');
      title.textContent = post.title;

      const meta = document.createElement('div');
      meta.classList.add('box-meta');
      meta.textContent = `Posted on ${post.date}`;

      const content = document.createElement('div');
      content.classList.add('box-content');
      content.innerHTML = `<p>${post.content}</p>`;

      box.appendChild(img);
      box.appendChild(title);
      box.appendChild(meta);
      box.appendChild(content);

      // Create and add share button
      const shareButton = document.createElement('div');
      shareButton.classList.add('share-button');
      shareButton.innerHTML = '<i class="fas fa-share"></i>';

      const dropdown = document.createElement('div');
      dropdown.classList.add('dropdown');
      dropdown.innerHTML = `
        <div class="dropdown-content">
          <a href="#" class="share-link" data-platform="facebook"><i class="fab fa-facebook"></i> Share on Facebook</a>
          <a href="#" class="share-link" data-platform="twitter"><i class="fab fa-twitter"></i> Share on Twitter</a>
          <a href="#" class="share-link" data-platform="linkedin"><i class="fab fa-linkedin"></i> Share on LinkedIn</a>
          <a href="#" class="copy-link"><i class="fas fa-link"></i> Copy Link</a>
        </div>
      `;
      shareButton.appendChild(dropdown);
      box.appendChild(shareButton);

      // Add event listener for box navigation
      box.addEventListener('click', function() {
        window.location.href = post.link;
      });

      // Share button functionality
      shareButton.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown.classList.toggle('active');
      });

      // Share links functionality
      const shareLinks = dropdown.querySelectorAll('.share-link');
      shareLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          event.preventDefault();
          const platform = link.getAttribute('data-platform');
          const shareUrl = buildShareUrl(platform, post.link, post.title);
          window.open(shareUrl, '_blank');
        });
      });

      // Copy link functionality
      const copyLink = dropdown.querySelector('.copy-link');
      copyLink.addEventListener('click', function(event) {
        event.preventDefault();
        copyToClipboard(post.link);
        alert('Link copied to clipboard');
      });

      boxContainer.appendChild(box);
    });
  }

  // Function to build share URLs
  function buildShareUrl(platform, href, title) {
    switch(platform) {
      case 'facebook':
        return 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(href);
      case 'twitter':
        return 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(href) + '&text=' + encodeURIComponent(title);
      case 'linkedin':
        return 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title);
      default:
        return '#';
    }
  }

  // Function to copy text to clipboard
  function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
      }
    });
  });

  // Search functionality
  searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase();
    const filteredPosts = postsData.filter(post => {
      const date = post.date.toLowerCase();
      const tags = post.tags ? post.tags.map(tag => tag.toLowerCase()).join(' ') : '';
      return date.includes(query) || tags.includes(query);
    });
    renderPosts(filteredPosts);
  });

  // Other existing functions for navbar, search, etc.
  const navbar = document.querySelector('.navbar');
  const searchContainer = document.querySelector('.search-container');
  const searchIcon = document.querySelector('.search-icon');

  window.toggleMenu = function() {
    navbar.classList.toggle('active');
  }

  window.toggleSearch = function() {
    searchContainer.style.display = (searchContainer.style.display === 'block') ? 'none' : 'block';
    searchIcon.classList.toggle('active');
  }

  window.addEventListener('scroll', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
    navbar.classList.remove('active');
    searchContainer.style.display = 'none';
    searchIcon.classList.remove('active');
  });
});

