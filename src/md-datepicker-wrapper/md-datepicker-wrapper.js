(function() {
  'use strict';
  
  angular.module('md-datepicker-wrapper', ['ngMaterial'])
         .constant('mdDatepickerWrapperArrows', {
           arrowLeft: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwb2x5Z29uIHBvaW50cz0iMTUuNCw3LjQgMTQsNiA4LDEyIDE0LDE4IDE1LjQsMTYuNiAxMC44LDEyICIvPjwvZz48L3N2Zz4=',
           arrowRight: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cGF0aCBkPSJNOC41OSAxNi4zNGw0LjU4LTQuNTktNC41OC00LjU5TDEwIDUuNzVsNiA2LTYgNnoiPjwvcGF0aD48L3N2Zz4='
         })
         .directive('mdDatepickerWrapper', mdDatepickerWrapper);
  
  function mdDatepickerWrapper() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: function() {
        return '<div class="md-datepicker-wrapper" ng-transclude></div>';
      },
      link: function(scope, element, attribute, controller) {
        controller.setVariables(element);
      },
      controllerAs: 'mdWrapper',
      controller: DatepickerWrapperController
    }
  }
  
  function DatepickerWrapperController(mdDatepickerWrapperArrows, $compile, $timeout, $scope) {
    this.mdDatepickerWrapperArrows = mdDatepickerWrapperArrows;
    this.clickOnNagitateArrows = false;
    this.$compile = $compile;
    this.$timeout = $timeout;
    this.$scope = $scope;
  }
  
  DatepickerWrapperController.prototype.setVariables = function(element) {
    var self = this;
    
    self.datepicker = element[0].querySelector('md-datepicker');
    self.calendarPane = element[0].querySelector('.md-datepicker-calendar-pane');
    
    self.addArrowsToCalendarTemplate();
    self.decorateChildController();
  };
  
  DatepickerWrapperController.prototype.getMdDatepickerController = function() {
    return angular.element(this.datepicker).controller('mdDatepicker');
  };
  
  DatepickerWrapperController.prototype.getMdDatepickerScope = function() {
    return angular.element(this.datepicker).scope();
  };
  
  DatepickerWrapperController.prototype.decorateChildController = function() {
    var controller = this.getMdDatepickerController().constructor,
      parent = this,
      originalMethod = angular.copy(controller.prototype.closeCalendarPane);
    
    controller.prototype.closeCalendarPane = function() {
      if (parent.clickOnNagitateArrows) {
        return false;
      }
      
      originalMethod.apply(this, arguments);
    };
  };
  
  DatepickerWrapperController.prototype.addArrowsToCalendarTemplate = function() {
    var inputMask = this.datepicker.querySelector('.md-datepicker-input-mask'),
      arrows = document.createElement('div'),
      leftArrow = document.createElement('div'),
      rightArrow = document.createElement('div'),
      buttonLeft = document.createElement('md-button'),
      buttonRight,
      iconLeft = document.createElement('md-icon'),
      iconRight;
    
    iconLeft.className = "md-datepicker-calendar-icon";
    iconLeft.setAttribute('aria-label', 'md-calendar');
    
    iconRight = angular.copy(iconLeft);
    iconLeft.setAttribute('md-svg-src', this.mdDatepickerWrapperArrows.arrowLeft);
    iconRight.setAttribute('md-svg-src', this.mdDatepickerWrapperArrows.arrowRight);
    
    buttonLeft.className = "md-datepicker-button md-icon-button";
    buttonLeft.setAttribute('type', 'button');
    buttonLeft.setAttribute('tabindex', '-1');
    
    buttonRight = angular.copy(buttonLeft);
    buttonLeft.setAttribute('ng-click', 'mdWrapper.navigateToPreviousMonth($event)');
    buttonLeft.appendChild(iconLeft);
    buttonRight.setAttribute('ng-click', 'mdWrapper.navigateToNextMonth($event)');
    buttonRight.appendChild(iconRight);
    
    leftArrow.className = "md-datepicker-wrapper-arrows-left";
    leftArrow.appendChild(buttonLeft);
    
    rightArrow.className = "md-datepicker-wrapper-arrows-right";
    rightArrow.appendChild(buttonRight);
    
    arrows.className = "md-datepicker-wrapper-arrows";
    arrows.appendChild(leftArrow);
    arrows.appendChild(rightArrow);
    
    inputMask.className += ' md-datepicker-wrapper-input-mask';
    inputMask.insertBefore(arrows, inputMask.childNodes[0]);
    
    var directiveScope = this.getMdDatepickerScope();
    this.$compile(inputMask)(directiveScope);
  };
  
  DatepickerWrapperController.prototype.navigateToPreviousMonth = function() {
    var self = this;
    
    self.clickOnNagitateArrows = true;
    self.$scope.$broadcast('md-calendar-parent-action', 'move-page-up');
    
    self.$timeout(function() {
      self.clickOnNagitateArrows = false;
    }, 200)
  };
  
  DatepickerWrapperController.prototype.navigateToNextMonth = function() {
    var self = this;
    
    self.clickOnNagitateArrows = true;
    self.$scope.$broadcast('md-calendar-parent-action', 'move-page-down');
    
    self.$timeout(function() {
      self.clickOnNagitateArrows = false;
    }, 200)
  }
})();