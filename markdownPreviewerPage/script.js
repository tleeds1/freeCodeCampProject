$(document).ready(function() {
  function updatePreview() {
      const markdownText = $('#editor').val();

      const htmlContent = marked(markdownText, { 
          breaks: true,
          highlight: function(code, lang) {
              return Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup, lang);
          }
      });

      $('#preview').html(htmlContent);
  }

  $('#editor').on('input', updatePreview);

  updatePreview();
});