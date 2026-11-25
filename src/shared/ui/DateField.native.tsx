import { useState } from 'react';
import { Platform, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { AppButton } from './AppButton';
import { DateTextField, type DateFieldProps } from './DateTextField';
import { parseCalendarDate } from '@/shared/utils/calendarDate';
import { spacing } from '@/shared/theme/tokens';

export function DateField(props: DateFieldProps) {
  const [visible, setVisible] = useState(false);
  const parts = parseCalendarDate(props.value);
  const selected = new Date();
  if (parts) selected.setFullYear(parts.year, parts.month - 1, parts.day);
  selected.setHours(12, 0, 0, 0);

  const change = (event: DateTimePickerEvent, date?: Date) => {
    setVisible(false);
    if (event.type !== 'set' || !date) return;
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    props.onChange(`${year}-${month}-${day}`);
  };
  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value: selected, mode: 'date', onChange: change });
    } else {
      setVisible(true);
    }
  };
  return (
    <View style={{ gap: spacing.sm }}>
      <DateTextField {...props} />
      <AppButton label={`選擇${props.label}`} onPress={open} secondary disabled={props.disabled} />
      {visible ? <DateTimePicker value={selected} mode="date" onChange={change} /> : null}
    </View>
  );
}
