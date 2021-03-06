import { propertyEqual } from 'discourse/lib/computed';
import ObjectController from 'discourse/controllers/object';

export default ObjectController.extend({
  taken: false,
  saving: false,
  error: false,
  success: false,
  newEmail: null,

  newEmailEmpty: Em.computed.empty('newEmail'),
  saveDisabled: Em.computed.or('saving', 'newEmailEmpty', 'taken', 'unchanged'),
  unchanged: propertyEqual('newEmailLower', 'email'),

  newEmailLower: function() {
    return this.get('newEmail').toLowerCase();
  }.property('newEmail'),

  saveButtonText: function() {
    if (this.get('saving')) return I18n.t("saving");
    return I18n.t("user.change");
  }.property('saving'),

  actions: {
    changeEmail: function() {
      var self = this;
      this.set('saving', true);
      return this.get('content').changeEmail(this.get('newEmail')).then(function() {
        self.set('success', true);
      }, function(data) {
        self.setProperties({ error: true, saving: false });
        if (data.responseJSON && data.responseJSON.errors && data.responseJSON.errors[0]) {
          self.set('errorMessage', data.responseJSON.errors[0]);
        } else {
          self.set('errorMessage', I18n.t('user.change_email.error'));
        }
      });
    }
  }

});


