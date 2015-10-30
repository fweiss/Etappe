angular.module('plan')
    // webkit localeFormat returns 13:15:00, while chrome returns 1:15:00 PM
.service('date', function() {
        return {
            format: function(raw) {
                var p1 = raw.indexOf(' ');
                if (p1 < 0) {
                    var parts = raw.split(':');
                    return (parts[0] - 12) + ':' + parts[1] + ' PM';
                }
                return raw.substring(0, p1 - 3) + raw.substring(p1);
            }
        }
    });
