
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceHyphen',
  standalone: true
})
export class ReplaceHyphenPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    return value.replace(/-/g, ' '); 
  }
}