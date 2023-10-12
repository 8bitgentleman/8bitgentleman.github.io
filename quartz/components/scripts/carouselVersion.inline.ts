document.addEventListener("nav", () => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        var items = Array.from(carousel.querySelectorAll('.carousel-item'));
        var currentIndex = 0;
        
        carousel.querySelector('.next').addEventListener('click', function() {
          items[currentIndex].classList.remove('active');
          currentIndex = (currentIndex + 1) % items.length;
          items[currentIndex].classList.add('active');
        });
      
        carousel.querySelector('.prev').addEventListener('click', function() {
          items[currentIndex].classList.remove('active');
          currentIndex = (currentIndex - 1 + items.length) % items.length;
          items[currentIndex].classList.add('active');
        });
      });
})