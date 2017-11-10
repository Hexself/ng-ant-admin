import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {UserService} from './user.service';
import {UserformComponent} from './userform/userform.component';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['./user.component.less'],
  providers: [UserService]
})

export class UserComponent implements OnInit {
  current = 1;
  pageSize = 10;
  total = 1;
  dataSet = [];
  loading = true;
  roleData: any;
  gridView = {
    tableFields: [
      {
        field: 'id',
        text: 'Id'
      },
      {
        field: 'avatar',
        text: 'Avatar'
      },
      {
        field: 'name',
        text: 'Name'
      },
      {
        field: 'nickName',
        text: 'NickName'
      },
      {
        field: 'phone',
        text: 'Phone',
      },
      {
        field: 'age',
        text: 'Age',
      },
      {
        field: 'address',
        text: 'Address',
      },
      {
        field: 'isMale',
        text: 'IsMale',
      },
      {
        field: 'email',
        text: 'Email',
      },
      {
        field: 'createTime',
        text: 'CreateTime',
      },
      {
        type: 2,
        text: '操作',
        handles: [
          {
            text: '修改',
            key: 'adminId',
            event: (id) => {
              this.create(id);
            }
          },
          {
            text: '删除',
            key: 'adminId',
            confirm: {
              title: '确定要删除这个任务吗？',
              event: {
                ok: (id) => {
                  this._delete(id);
                },
                cancel: () => {
                  this.message.info('click cancel');
                }
              }
            }
          }
        ]
      }
    ]
  };

  constructor(private userService: UserService, private message: NzMessageService, private modalService: NzModalService) {
  }

  refreshData = (event?: number) => {
    this.loading = true;
    this.userService.getUserList(event || this.current, this.pageSize)
      .then((result: any) => {
        this.dataSet = result.data;
        this.total = result.total;
        this.loading = false;
      }, (err) => {

      });
  }

  async ngOnInit() {
    /*await this.roleService.queryAll()
      .then((result: any) => {
        this.roleData = result.data;
      })
    console.log(this.roleData);*/
    this.refreshData();
  }

  create(id) {
    const subscription = this.modalService.open({
      title: id ? '修改管理员信息' : '创建管理员信息',
      content: UserformComponent,
      onOk() {
      },
      onCancel() {
        console.log('Click cancel');
      },
      footer: false,
      componentParams: {
        id: id
      }
    });
    subscription.subscribe(result => {
      if (result === 'ok') {
        this.refreshData();
      }
    });
  }

  _delete(id) {
    this.userService.remove(id)
      .then((result: any) => {
        this.refreshData();
        this.message.info(result.msg);
      }, (err) => {
      });
  }
}
