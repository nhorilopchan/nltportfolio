/* Filterable Content */

document.addEventListener('DOMContentLoaded', function() {
    /* Global Variables */
    const filterParentControl = document.getElementById('contentsParent');

    /* Functions */
    //Toggle CssClasses
    function toggleClass(control,className){
        if (control.classList) {
            control.classList.toggle(className);
        } else {
            var classes = control.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(className);

            control.className = classes.join(' ');
        }
    }
    //Dropdowns
    function showHideMedia(mediaItems,controlClass){
        [].forEach.call(mediaItems, mediaItem => {
            mediaItem.addEventListener('change', evt => {
                const { value } = evt.target;
                const dataFilter = mediaItem.dataset.filter;
                const filterType = mediaItem.getAttribute('class');
                const filtercontrols = document.querySelectorAll(`${controlClass}:checked`);

                //Add class "filteringOn" on click
                if(!filterParentControl.classList.contains('filteringOn')){
                    filterParentControl.classList.add('filteringOn');
                }

                var contents = document.querySelectorAll(`.contents-list li[data-filter*="${mediaItem.value}"]`);
                [].forEach.call(contents,content=>{
                    toggleClass(content,'checked');
                    createResultsMessage({ value });
                });
                if(mediaItem.checked) {
                    // console.log(mediaItem);
                    createFilterBadges(mediaItem.value, mediaItem.dataset.filter, mediaItem.getAttribute('class'));
                }
                else{
                    var badgesParent = document.querySelector('.selected-filters');
                    var selectedBadgeToRemove = document.querySelector(`.selected-filters span[value="${mediaItem.value}"]`);

                    //When no checkboxes/radiobuttons are checked, display all results
                    if(!document.querySelectorAll(`.filter-list:checked`).length ||!document.querySelectorAll(`.filter-radio:checked`).length){
                        filterParentControl.classList.remove('filteringOn');
                    }
                    if(selectedBadgeToRemove != null) {
                        removeFilterContent(badgesParent, selectedBadgeToRemove);
                    }
                }

            });
        });
    }
    //Create Result Message
    function createResultsMessage(){
        // console.log("CREATE MSG");
        var resultsLabel = document.querySelector('.results-message');
        var filteredItems = document.querySelectorAll('.contents-list li.checked');
        if(filteredItems.length){
            resultsLabel.innerHTML = `Displaying ${filteredItems.length} of ${filteredItems.length}`;
            // console.log(filteredItems);
        }
        else {
            var totalSearchItems = document.querySelectorAll('.contents-list li').length;
            resultsLabel.innerHTML = `Displaying ${totalSearchItems} of ${totalSearchItems}`;
            // console.log(totalSearchItems);
        }
    }
    //Filter Badges
    function createFilterBadges(selectedFilter, selectedFilterAtt,selectedFilterType) {
        if (selectedFilter != undefined) {
            var selectedBadgesParent = document.querySelector('.selected-filters');

            //Create new Badge
            var filterBadge = document.createElement('span');
            //Add attributes
            filterBadge.classList.add('badge','checked');
            filterBadge.setAttribute('data-filter', selectedFilterAtt);
            filterBadge.setAttribute('data-control', selectedFilterType);
            filterBadge.setAttribute('value', selectedFilter);
            filterBadge.innerHTML = selectedFilter;

            if(selectedBadgesParent.children.length){
                var childBadges = document.querySelector(`.selected-filters span[value="${selectedFilter}"]`);
                // console.log(childBadges);
                if(childBadges != null) {
                    //Filter Badge exists
                    return false;
                }
            }
            //Insert new Badge
            selectedBadgesParent.insertBefore(filterBadge, selectedBadgesParent.firstChild);

            //Click event to each selected Filter Badge\
            filterBadge.addEventListener('click', event => {
                const badge = event.target;
                // console.log('this');
                console.log(selectedBadgesParent.childElementCount);
                if(selectedBadgesParent.childElementCount < 2){
                    if(filterParentControl.classList.contains('filteringOn')){
                        filterParentControl.classList.remove('filteringOn');
                    }
                    else if(filterParentControl.classList.contains('filteringByTextOn')){
                        filterParentControl.classList.remove('filteringByTextOn');
                    }
                }

                removeFilterContent(selectedBadgesParent, event.target);
                var dataFilterAttribute = badge.dataset.filter;
                var filterControlType = badge.dataset.control;
                clearSelectedFilters(dataFilterAttribute, event.target, filterControlType);
            });
        }
    }
    //Remove Filters from Content
    function removeFilterContent(filtersBadges,selectedFilter){
        //Remove selected Filter from Content Lists

        console.log(selectedFilter.innerHTML);
        var mediaListItems = document.querySelectorAll(`.contents-list li[data-filter*="${selectedFilter.innerHTML}"]`);
        console.log(mediaListItems);
        [].forEach.call(mediaListItems, mediaListItem => {
            console.log("REMOVING");
            console.log(mediaListItem);
            if(mediaListItem.classList.contains('checked')){
                mediaListItem.classList.remove('checked');
            }
        });
        filtersBadges.removeChild(selectedFilter);
        //Handle textbox clear event
        if(document.querySelectorAll('.search-list li[data-selected="true"]').length){
            var selectedInputItem = document.querySelectorAll('.search-list li[data-selected="true"]')[0];
            selectedInputItem.setAttribute("data-selected","false");
            document.getElementById('search-text-input').value='';
        }
        createResultsMessage();
    }
    //Clear all Filter Controls
    //Checkboxes
    function clearSelectedFilters(dataFilterAtt,currControl,filterType) {
        var controls =  document.querySelectorAll(`.${filterType}[data-filter*="${dataFilterAtt}"][value="${currControl.innerHTML}"]`);
        console.log(controls);
        [].forEach.call(controls, (control) => {
            control.checked = false;
        });

    }
    //Clear ALL Filters
    function clearAllFilters(controls){
        console.log(controls);
        [].forEach.call(controls, currcontrol=>{
            console.log(controls);
            [].forEach.call(currcontrol,control=>{
                control.checked = false;
            });
        });
    }

    /* Events */
    if(document.querySelectorAll('.filterable-content-block').length){
        //Adds search icon to the search input field
        document.addEventListener('click', function() {
            //Hide the autocomplete dropdownlist on click outside the input box
            if(document.querySelector('.search-list').classList.contains('active')){
                document.querySelector('.search-list').classList.remove("active");
            }
            //Hide checkboxes dropdowns
            // var filters = document.querySelectorAll('.toggle');
            // [].forEach.call(filters,filter =>{
            //     console.log(filter);
            //     if(filter.classList.contains('expanded')){
            //         filter.classList.remove("expanded");
            //     }
            //     var filterDropdown = filter.nextElementSibling;
            //     if(filterDropdown.classList.contains('show')){
            //         filterDropdown.classList.remove("show");
            //     }
            // });
        });

        //Create div for "Search Icon" and insert div element in the parent
        var searchinputel = document.getElementById('search-input');
        var eldiv = document.createElement('div');
        searchinputel.insertBefore(eldiv,searchinputel.firstChild);
        eldiv.className += " search icon";

        //Search By Genre/Year Toggle on click
        var toggleControls = document.querySelectorAll('.toggle');
        [].forEach.call(toggleControls,toggleControl => {
            toggleControl.addEventListener('click',evt=>{
                const el = evt.target;
                //Toggle CssClass on controls
                toggleClass(el,'expanded');
                var next = el.nextElementSibling;
                //Toggle CssClass on Dropdowns
                toggleClass(next,'show');
            });
        });
        //Search By Title - Autocomplete
        var searchinput = document.querySelector('#search-input');

        //Add class 'filteringByTextOn'
        if(document.querySelector('#search-text-input').value.length){
            if(filterParentControl.classList.contains('filteringByTextOn')){
                filterParentControl.classList.add('filteringByTextOn');
            }
        }

        //Trigger Textbox keyup event
        searchinput.addEventListener('keyup', function(evt) {
            const { value } = evt.targegulpt;
            var pat = new RegExp(value, 'i');
            var searchList = document.querySelector('.search-list');
            if(!searchList.classList.contains('active')) {
                searchList.classList.add('active');
            }
            if(!document.querySelector('#search-input').classList.contains('active')) {
                document.querySelector('#search-input').classList.add('active');
                //Clear Textbox
                var closeIcon = document.querySelector('.search-input.active .search.icon');
                closeIcon.addEventListener('click',evt=>{
                    console.log(evt.target);
                    //Empty textbox
                    document.querySelector('#search-text-input').value = '';
                    //Remove class active to display search icon
                    if(document.querySelector('.search-input.active').classList.contains('active')){
                    document.querySelector('.search-input.active').classList.remove('active');
                    }
                    //Remove filtering
                    var filteredItems = document.querySelectorAll(`.filteringTextOn li.checked[data-filter*="${value}"]`);
                    filteredItems.forEach(filteredItem =>{
                       if(filteredItem.classList.contains('checked')){
                           filteredItem.classList.remove('checked');
                       }
                    });
                    if( document.getElementById("contentsParent").classList.contains('filteringByTextOn')){
                        document.getElementById("contentsParent").classList.remove('filteringTextOn');
                    }
                    createResultsMessage();
                });
            }
            //If input field is empty, hide the list
            if(value.length < 1){
                if(document.querySelector('.search-list').classList.contains('active')){
                    document.querySelector('.search-list').classList.remove('active');
                }
                if(filterParentControl.classList.contains('filteringByTextOn')){
                    filterParentControl.classList.remove('filteringByTextOn');
                }
                var selectedItems = document.querySelectorAll('.contents-list li.checked');
                selectedItems.forEach(item=>{
                    if(item.classList.contains('checked')){
                        item.classList.remove('checked');
                    }
                })
                createResultsMessage();
            }
            //Show/Hide matching items (autocomplete)
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (pat.test(item.innerText)) {
                    item.className = item.className.replace(/\s+?hidden/, '');
                }
                else if(!item.classList.contains('hidden')) {
                    item.className = item.className + ' hidden';
                }
            }
        });


        //Click event on each item on the autocomplete dropdown
        var items = document.querySelector('.search-list').getElementsByTagName('li');
        [].forEach.call(items,item=>{
            item.addEventListener('click',evt=>{
                const { value } = evt.target;
                item.dataset.selected = true;
                var textBox = document.getElementById('search-text-input');
                // console.log(textBox.value);
                // console.log(item.innerHTML);
                textBox.value = item.innerHTML;
                //Create Filter Badge
                createFilterBadges(textBox.value, item.dataset.filter,null);
                //Add unique class to identify search by text
                if(!filterParentControl.classList.contains('filteringByTextOn')){
                    filterParentControl.classList.add('filteringByTextOn');
                }
                var contentsList = document.querySelectorAll(`.contents-list .info-name-year[data-name="${item.innerHTML}"]`);
                contentsList.forEach(contentItem=>{
                    if(contentItem.parentNode.parentNode.classList.contains('checked')){
                        contentItem.parentNode.parentNode.classList.remove('checked');
                    }
                    else {
                        contentItem.parentNode.parentNode.classList.add('checked');
                        createResultsMessage();
                    }
                });
            });
        });

        //By Genre and Year - Dropdowns
        const checkboxClass = '.filter-list';
        const checkboxes = document.querySelectorAll(checkboxClass);
        showHideMedia(checkboxes,checkboxClass);

        //By Type - Radiobuttons
        const radiobtnClass = '.filter-radio';
        const radiobtns = document.querySelectorAll(radiobtnClass);
        showHideMedia(radiobtns,radiobtnClass);

        //Search Results Info
        createResultsMessage();
        //Clear All Filters Button Click
        var clearFilterButton = document.getElementById('clearfilters');
        clearFilterButton.addEventListener('click', evt => {
            evt.preventDefault();
            //Clear selected Filters Badges
            var selectedFilterBadges = document.querySelector('.selected-filters');
            selectedFilterBadges.innerHTML = " ";

            //Show all media items
            if(filterParentControl.classList.contains('filteringOn')){
                filterParentControl.classList.remove('filteringOn');
            }
            if(filterParentControl.classList.contains('filteringByTextOn')){
                filterParentControl.classList.remove('filteringByTextOn');
            }
            var mediaListItems = document.querySelectorAll('.contents-list li');
            [].forEach.call(mediaListItems, mediaListItem => {
                if(mediaListItem.classList.contains('checked')){
                    mediaListItem.classList.remove('checked');
                }
            });
            //Clear All Filters
            //TextBox
            document.getElementById('search-text-input').value='';
            //CheckBoxes
            var checkBoxes = document.querySelectorAll('.filter-list:checked');
            //Radiobuttons
            var radioButtons = document.querySelectorAll('.filter-radio:checked');
            clearAllFilters([checkBoxes,radioButtons]);

            //Reset Total Items Message
            createResultsMessage();
        });
    }
})
