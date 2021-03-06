require "backup_restore/backup_restore"

module Jobs
  class CreateBackup < Jobs::Base
    sidekiq_options retry: false

    def execute(args)
      return unless SiteSetting.backups_enabled?
      BackupRestore.backup!(Discourse.system_user.id, publish_to_message_bus: false)
    end
  end
end
