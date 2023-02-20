import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent {
  noteText = '';
  isEdit = false;

  // inject mat dialog data
  constructor(
    private dialogRef: MatDialogRef<NotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.note.length) {
      this.isEdit = true;
      this.noteText = data.note;
    }
  }

  addNote() {
    if (this.noteText) {
      this.dialogRef.close(this.noteText);
    }
  }
}
