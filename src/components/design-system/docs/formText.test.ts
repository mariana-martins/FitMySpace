import { formText } from './formText';

/* ===============================================================
 * FORM TEXT
 * =============================================================== */

describe('formText — values', () => {
  it('returns the text a field submitted', () => {
    const formData = new FormData();
    formData.set('room-name', 'Study');

    expect(formText(formData, 'room-name')).toBe('Study');
  });

  it('returns an empty string for a field that was not submitted', () => {
    expect(formText(new FormData(), 'room-name')).toBe('');
  });

  it('returns an empty string for a file, which has no text value', () => {
    const formData = new FormData();
    formData.set('photo', new File(['shelf'], 'shelf.png'));

    expect(formText(formData, 'photo')).toBe('');
  });
});
