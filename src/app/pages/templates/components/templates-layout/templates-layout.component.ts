import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject } from '@angular/core';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { MatIcon } from '@angular/material/icon';
import { DataViewComponent } from '@shared/components/data-view/data-view.component';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { SelectionBarComponent } from '@shared/components/selection-bar/selection-bar.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import {
  DeleteTemplates,
  FetchTemplateList,
  SelectAllTemplates,
  SetSelectedTemplates,
  SetTemplateListSearchValue,
  SetTemplatesDataViewDisplayType,
} from '@app/pages/templates/state/templates.actions';
import { TemplateListComponent } from '@app/pages/templates/components/template-list/template-list.component';
import { AnimatedIfDirective } from '@shared/directives/animated-if.directive';
import { SharedLocalization } from '@shared/shared.constants';
import { TemplateTableComponent } from '@app/pages/templates/components/template-table/template-table.component';

@Component({
  selector: 'templates-layout',
  imports: [
    DataViewComponent,
    MatIcon,
    MatMiniFabButton,
    SelectionBarComponent,
    UiSkeletonComponent,
    TemplateListComponent,
    AnimatedIfDirective,
    TemplateTableComponent,
  ],
  templateUrl: './templates-layout.component.html',
  styleUrl: './templates-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesLayoutComponent {
  protected readonly uiSidenavService = inject(UiSidenavService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly document = inject(DOCUMENT);
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly selectors = createSelectMap({
    displayType: TemplatesState.getDisplayType$,
    searchValue: TemplatesState.getSearchValue$,
    selectedTemplateList: TemplatesState.getSelectedTemplateList$,
    isDeleteInProgress: TemplatesState.isDeleteInProgress$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetTemplatesDataViewDisplayType,
    fetchTemplateList: FetchTemplateList,
    setTemplateListSearchValue: SetTemplateListSearchValue,
    setSelectedTemplates: SetSelectedTemplates,
    selectAllTemplates: SelectAllTemplates,
    deleteTemplates: DeleteTemplates,
  });

  protected openAdvancedSearch(): void {
    this.uiSidenavService.open(MatButton, {
      content: [[this.document.createTextNode(SharedLocalization.close)]],
      position: 'end',
    });
    const closeAction = (): void => {
      this.uiSidenavService.close();
      this.uiSidenavService.sidenavCmpRef()?.location.nativeElement.removeEventListener('click', closeAction);
    };
    this.uiSidenavService.sidenavCmpRef()?.location.nativeElement.addEventListener('click', closeAction);
  }
}
