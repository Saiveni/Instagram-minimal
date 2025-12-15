// Add interactive functionality for posts
document.addEventListener('DOMContentLoaded', function() {
    // Handle like button clicks
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ed4956';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    });

    // Handle share button clicks
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Share functionality - In a real app, this would open share options');
        });
    });

    // Handle save button clicks
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });

    // Handle profile clicks in post headers
    document.querySelectorAll('.post-header').forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                const username = this.querySelector('strong').textContent;
                alert(`View profile: ${username}`);
            }
        });
    });

    // Handle story clicks
    document.querySelectorAll('.story').forEach(story => {
        story.addEventListener('click', function() {
            const username = this.querySelector('span').textContent;
            alert(`View story: ${username}`);
        });
    });
});