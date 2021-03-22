document.addEventListener('DOMContentLoaded', () => {
  
  const isPrivateCheckbox = document.getElementById('isPrivateCheckbox');
  const channelNameInput = document.getElementById('channelNameInput');
  const descriptionTextArea = document.getElementById('descriptionTextArea');
  const userSelect = document.getElementById('userSelect');
  const inputs = [channelNameInput, descriptionTextArea, userSelect];

  // default setup for creating channel
  userSelect.parentNode.classList.add('hidden');

  isPrivateCheckbox.addEventListener('change', () => {
    inputs.forEach(input => {
      input.parentNode.classList.toggle('hidden');
      input.toggleAttribute('required');
      
      if (input.parentNode.classList.contains('hidden')) {
        input.value = null;        
      }
    });
  });

});