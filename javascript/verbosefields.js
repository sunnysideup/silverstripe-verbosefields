const verboseField = {
  init: function () {
    const observer = new MutationObserver(verboseField.mutationCallback)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    this.attachListeners()
  },

  mutationCallback: function (mutations) {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        verboseField.attachListeners()
      }
    })
  },

  attachListeners: function () {
    // Append verbose-description divs
    document
      .querySelectorAll('.verboseoptionset.field .form__field-holder')
      .forEach(holder => {
        if (!holder.querySelector('.verbose-description')) {
          const descriptionDiv = document.createElement('div')
          descriptionDiv.className = 'verbose-description'
          if (holder.firstChild) {
            holder.insertBefore(descriptionDiv, holder.firstChild)
          } else {
            holder.appendChild(descriptionDiv)
          }
          // Attach event listeners to inputs
          holder
            .querySelectorAll('.verboseoptionset.field input')
            .forEach(input => {
              input.addEventListener(
                'change',
                verboseField.handleChange.bind(input)
              )
              const closestInputHolder = verboseField.closestInputHolder(input)
              closestInputHolder.addEventListener(
                'mouseover',
                verboseField.handleMouseOver.bind(closestInputHolder)
              )
              closestInputHolder.addEventListener(
                'mouseout',
                verboseField.handleMouseOut.bind(closestInputHolder)
              )
            })
          const checkedItem = holder.querySelector('input:checked')
          if (checkedItem) {
            verboseField.showDescription(checkedItem)
          }
          holder.addEventListener('scroll', function () {
            const scrollContainer = this
            const image = scrollContainer.querySelector('.verbose-description')
            const scrollPosition = scrollContainer.scrollTop
            image.style.marginTop = scrollPosition + 'px'
            console.log('scrollPosition', scrollPosition)
          })
        }
      })
  },

  handleChange: function (event) {
    // console.log('change', this)
    if (!this.checked) {
      const checkedInput = verboseField.checkedInput(this)
      if (checkedInput) {
        verboseField.showDescription(checkedInput)
      }
    } else {
      verboseField.showDescription(this)
    }
  },

  handleMouseOver: function (event) {
    const input = this.querySelector('input')
    // console.log('handleMousOver', input)
    if (!input.checked) {
      verboseField.showDescription(input)
    }
  },

  handleMouseOut: function (event) {
    const input = this.querySelector('input')
    // console.log('handleMouseOut', input)
    if (!input.checked) {
      const checkedInput = verboseField.checkedInput(input)
      if (checkedInput) {
        verboseField.showDescription(checkedInput)
      }
    }
  },

  showDescription: function (input) {
    const descriptionEl = verboseField.closestFieldHolderDescription(input)
    if (!descriptionEl) {
      console.log('no descriptionEl', input)
      console.log('no descriptionEl', verboseField.closestFieldHolder(input))
      return
    }
    const data = input.getAttribute('data-description')
    if (data) {
      const html = verboseField.unescapeHTML(data)
      descriptionEl.style.height = ''
      descriptionEl.innerHTML = html ? html : data
      descriptionEl.style.height = `${descriptionEl.offsetHeight}px`
      descriptionEl.classList.add('has-item')
    } else {
      descriptionEl.innerHTML = 'No description available'
      descriptionEl.classList.remove('has-item')
    }
  },

  closestInputHolder: function (input) {
    return input.closest('.form-check')
  },

  closestFieldHolder: function (input) {
    return input.closest('.verboseoptionset.field')
  },

  checkedInput: function (input) {
    return verboseField.closestFieldHolder(input).querySelector('input:checked')
  },

  closestFieldHolderDescription: function (element) {
    const fieldHolder = verboseField.closestFieldHolder(element)
    return fieldHolder.querySelector('.verbose-description')
  },
  unescapeHTML: function (escapedHTML) {
    var tempDiv = document.createElement('div')
    tempDiv.innerHTML = escapedHTML
    return tempDiv.textContent || tempDiv.innerText || ''
  }
}

// Initialize
verboseField.init()
